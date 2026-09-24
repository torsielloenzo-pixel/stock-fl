-- Admin rewards: unrestricted catalogue access
-- Applied to project gioxrpaiwogqqtakjpnv on 2026-09-25.

create or replace function public.reward_buy(p_item uuid)
returns void
language plpgsql
set search_path = ''
as $function$
declare
  c public.reward_catalog;
  u uuid := auth.uid();
begin
  if u is null or not public.has_role(array['admin']) then
    raise exception 'Boutique réservée à l’administrateur';
  end if;

  select * into c
  from public.reward_catalog
  where id = p_item and active
  for share;

  if not found then
    raise exception 'Objet indisponible';
  end if;

  insert into public.reward_inventory(user_id, item_id)
  values (u, p_item)
  on conflict do nothing;
end
$function$;

create or replace function public.reward_equip(p_kind text, p_item uuid default null::uuid)
returns void
language plpgsql
set search_path = ''
as $function$
declare
  u uuid := auth.uid();
  item_ok boolean;
begin
  if u is null or not public.has_role(array['admin']) then
    raise exception 'Personnalisation réservée à l’administrateur';
  end if;

  if p_kind not in ('avatar','frame','accessory','title','theme') then
    raise exception 'Catégorie inconnue';
  end if;

  if p_item is null then
    delete from public.reward_equipment
    where user_id = u and kind = p_kind;
    return;
  end if;

  select exists (
    select 1
    from public.reward_catalog c
    where c.id = p_item
      and c.kind = p_kind
      and (
        c.active
        or exists (
          select 1
          from public.reward_inventory i
          where i.user_id = u and i.item_id = c.id
        )
      )
  ) into item_ok;

  if not item_ok then
    raise exception 'Objet indisponible pour cette catégorie';
  end if;

  insert into public.reward_inventory(user_id, item_id)
  select u, p_item
  where exists (
    select 1 from public.reward_catalog c
    where c.id = p_item and c.active
  )
  on conflict do nothing;

  insert into public.reward_equipment(user_id, kind, item_id)
  values (u, p_kind, p_item)
  on conflict(user_id, kind) do update
    set item_id = excluded.item_id;
end
$function$;
