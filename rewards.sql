-- Missions pilote : opérations réservées aux administrateurs.
-- Les employés voient uniquement le catalogue et les décorations équipées.
create table public.reward_catalog (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 70),
 kind text not null check(kind in ('avatar','frame','accessory','title','theme')),
 visual text not null check(length(visual) between 1 and 70), price integer not null check(price between 1 and 10000),
 active boolean not null default true, created_at timestamptz not null default now(), unique(id,kind)
);
create table public.reward_missions (
 id uuid primary key default gen_random_uuid(), title text not null check(length(title) between 1 and 120),
 instructions text not null check(length(instructions) between 1 and 2000), points integer not null check(points between 1 and 1000),
 deadline timestamptz, status text not null default 'open' check(status in ('open','reserved','submitted','approved','cancelled')),
 assigned_to uuid references public.profiles(id), reserved_until timestamptz, proof text check(length(proof)<=2000),
 review_note text check(length(review_note)<=1000), created_by uuid not null references public.profiles(id),
 reviewed_by uuid references public.profiles(id), created_at timestamptz not null default now(), reviewed_at timestamptz
);
create unique index reward_one_active_mission on public.reward_missions(assigned_to) where status='reserved';
create index reward_missions_status_date on public.reward_missions(status,created_at desc);
create table public.reward_wallets (user_id uuid primary key references public.profiles(id), balance integer not null default 0 check(balance>=0));
create table public.reward_inventory (
 user_id uuid not null references public.profiles(id), item_id uuid not null references public.reward_catalog(id),
 bought_at timestamptz not null default now(), primary key(user_id,item_id)
);
create table public.reward_equipment (
 user_id uuid not null references public.profiles(id), kind text not null, item_id uuid not null,
 primary key(user_id,kind), foreign key(item_id,kind) references public.reward_catalog(id,kind),
 foreign key(user_id,item_id) references public.reward_inventory(user_id,item_id)
);
create table public.reward_ledger (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id),
 amount integer not null check(amount<>0), description text not null,
 mission_id uuid unique references public.reward_missions(id), item_id uuid references public.reward_catalog(id),
 created_at timestamptz not null default now(), unique(user_id,item_id),
 check((mission_id is not null and item_id is null and amount>0) or (item_id is not null and mission_id is null and amount<0))
);
create index reward_ledger_user_date on public.reward_ledger(user_id,created_at desc);
create index reward_equipment_item on public.reward_equipment(item_id,kind);
create index reward_inventory_item on public.reward_inventory(item_id);
do $$ declare t text; begin
 foreach t in array array['reward_catalog','reward_missions','reward_wallets','reward_inventory','reward_equipment','reward_ledger'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select,insert,update,delete on public.%I to authenticated',t);
 execute format('create policy admin_access on public.%I for all to authenticated using ((select public.has_role(array[''admin'']))) with check ((select public.has_role(array[''admin''])))',t);
 end loop;
end $$;
create policy catalog_preview on public.reward_catalog for select to authenticated using ((select public.has_role(array['admin','responsable','employe','lecture'])));
create policy equipment_preview on public.reward_equipment for select to authenticated using ((select public.has_role(array['admin','responsable','employe','lecture'])));

create function public.reward_mission_action(p_id uuid,p_action text,p_note text default '') returns void
language plpgsql security invoker set search_path='' as $$
declare m public.reward_missions; u uuid:=auth.uid();
begin
 if u is null or not public.has_role(array['admin']) then raise exception 'Accès réservé à l’administrateur'; end if;
 -- Sérialise les réservations d’un même compte, même sur deux onglets.
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 update public.reward_missions set status='open',assigned_to=null,reserved_until=null where status='reserved' and reserved_until<=now();
 select * into m from public.reward_missions where id=p_id for update;
 if not found then raise exception 'Mission introuvable'; end if;
 if p_action='reserve' then
   if m.status<>'open' or (m.deadline is not null and m.deadline<=now()) then raise exception 'Mission indisponible ou expirée'; end if;
   if exists(select 1 from public.reward_missions where assigned_to=u and status='reserved') then raise exception 'Termine ou libère ta mission en cours'; end if;
   update public.reward_missions set status='reserved',assigned_to=u,reserved_until=least(now()+interval '1 hour',coalesce(deadline,now()+interval '1 hour')) where id=p_id;
 elsif p_action='release' then
   if m.status<>'reserved' then raise exception 'Cette mission n’est plus réservée'; end if;
   update public.reward_missions set status='open',assigned_to=null,reserved_until=null where id=p_id;
 elsif p_action='submit' then
   if m.status<>'reserved' or m.assigned_to<>u or m.reserved_until<=now() then raise exception 'Réservation expirée ou non attribuée à ce compte'; end if;
   if length(trim(p_note)) not between 3 and 2000 then raise exception 'Décris le travail réalisé (3 à 2000 caractères)'; end if;
   update public.reward_missions set status='submitted',proof=trim(p_note),reserved_until=null,review_note=null where id=p_id;
 elsif p_action='approve' then
   if m.status<>'submitted' then raise exception 'Seule une mission en attente peut être validée'; end if;
   insert into public.reward_wallets(user_id) values(m.assigned_to) on conflict do nothing;
   update public.reward_wallets set balance=balance+m.points where user_id=m.assigned_to;
   insert into public.reward_ledger(user_id,amount,description,mission_id) values(m.assigned_to,m.points,m.title,m.id);
   update public.reward_missions set status='approved',reviewed_by=u,reviewed_at=now(),review_note=nullif(trim(p_note),'') where id=p_id;
 elsif p_action='reject' then
   if m.status<>'submitted' then raise exception 'Cette mission n’attend pas de validation'; end if;
   if length(trim(p_note)) not between 3 and 1000 then raise exception 'Précise la correction attendue'; end if;
   update public.reward_missions set status='open',assigned_to=null,reserved_until=null,review_note=trim(p_note),reviewed_by=u,reviewed_at=now() where id=p_id;
 elsif p_action='cancel' then
   if m.status not in ('open','reserved') then raise exception 'Cette mission ne peut plus être annulée'; end if;
   update public.reward_missions set status='cancelled',reserved_until=null where id=p_id;
 else raise exception 'Action inconnue'; end if;
end $$;

create function public.reward_buy(p_item uuid) returns void language plpgsql security invoker set search_path='' as $$
declare c public.reward_catalog; u uuid:=auth.uid();
begin
 if u is null or not public.has_role(array['admin']) then raise exception 'Boutique réservée à l’administrateur'; end if;
 select * into c from public.reward_catalog where id=p_item and active for share;
 if not found then raise exception 'Objet indisponible'; end if;
 insert into public.reward_inventory(user_id,item_id) values(u,p_item) on conflict(user_id,item_id) do nothing;
end $$;
create function public.reward_equip(p_kind text,p_item uuid default null) returns void language plpgsql security invoker set search_path='' as $$
declare u uuid:=auth.uid(); c public.reward_catalog;
begin
 if u is null or not public.has_role(array['admin']) then raise exception 'Personnalisation réservée à l’administrateur'; end if;
 if p_kind not in ('avatar','frame','accessory','title','theme') then raise exception 'Catégorie inconnue'; end if;
 if p_item is null then delete from public.reward_equipment where user_id=u and kind=p_kind; return; end if;
 select * into c from public.reward_catalog where id=p_item and kind=p_kind and active for share;
 if not found then raise exception 'Objet indisponible'; end if;
 insert into public.reward_inventory(user_id,item_id) values(u,p_item) on conflict(user_id,item_id) do nothing;
 insert into public.reward_equipment(user_id,kind,item_id) values(u,p_kind,p_item) on conflict(user_id,kind) do update set item_id=excluded.item_id;
end $$;
revoke all on function public.reward_mission_action(uuid,text,text),public.reward_buy(uuid),public.reward_equip(text,uuid) from public,anon;
grant execute on function public.reward_mission_action(uuid,text,text),public.reward_buy(uuid),public.reward_equip(text,uuid) to authenticated;

insert into public.reward_catalog(name,kind,visual,price) values
 ('Renard malin','avatar','🦊',20),('Lion du rayon','avatar','🦁',50),('Robot de service','avatar','🤖',80),
 ('Orange signature','frame','#f97316',20),('Bleu électrique','frame','#2563eb',40),('Cercle doré','frame','#d4a017',90),
 ('Étoile montante','accessory','⭐',25),('Couronne','accessory','👑',75),('Éclair','accessory','⚡',40),
 ('As du rangement','title','As du rangement',30),('Esprit d’équipe','title','Esprit d’équipe',30),('Légende du magasin','title','Légende du magasin',150),
 ('Énergie orange','theme','#ea580c',30),('Équipe bleue','theme','#2563eb',50),('Violet intense','theme','#7c3aed',70);

