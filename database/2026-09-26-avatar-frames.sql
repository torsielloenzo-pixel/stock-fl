-- Cadres d'avatar Nethor — sélection administrateur uniquement.
alter table public.profiles
  add column if not exists avatar_frame text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname='profiles_avatar_frame_check'
      and conrelid='public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_avatar_frame_check
      check (avatar_frame is null or avatar_frame in ('admin','responsable','point_vente','employe','lecture'));
  end if;
end $$;

drop function if exists public.list_team_members();
drop function if exists private.list_team_members_impl();

create function private.list_team_members_impl()
returns table(
  id uuid,
  display_name text,
  role text,
  avatar_path text,
  status_text text,
  profile_color text,
  avatar_frame text
)
language sql
stable
security definer
set search_path=''
as $$
  select p.id,p.display_name,p.role,p.avatar_path,p.status_text,p.profile_color,p.avatar_frame
  from public.profiles p
  where (select auth.uid()) is not null
    and p.role <> 'admin'
  order by coalesce(p.display_name,'');
$$;

create function public.list_team_members()
returns table(
  id uuid,
  display_name text,
  role text,
  avatar_path text,
  status_text text,
  profile_color text,
  avatar_frame text
)
language sql
stable
set search_path=''
as $$
  select * from private.list_team_members_impl();
$$;

revoke all on function private.list_team_members_impl() from public, anon;
grant execute on function private.list_team_members_impl() to authenticated;
revoke all on function public.list_team_members() from public, anon;
grant execute on function public.list_team_members() to authenticated;

-- Ne pas accorder UPDATE(avatar_frame) à authenticated :
-- la valeur est modifiée uniquement par l'Edge Function admin-manage-user via service_role.
