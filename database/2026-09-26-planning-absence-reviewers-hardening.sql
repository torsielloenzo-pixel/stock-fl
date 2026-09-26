-- Durcissement de la résolution des destinataires des demandes de congés.
-- Le wrapper public reste SECURITY INVOKER ; l'implémentation privilégiée reste hors schéma exposé.

drop function if exists public.planning_absence_reviewer_ids();

create or replace function private.planning_absence_reviewer_ids_impl()
returns table(user_id uuid)
language sql
stable
security definer
set search_path=''
as $$
  select p.id
  from public.profiles p
  where (select auth.uid()) is not null
    and private.planning_absence_permission((select auth.uid())) in ('request','manage')
    and private.planning_absence_permission(p.id) = 'manage';
$$;

revoke all on function private.planning_absence_reviewer_ids_impl() from public, anon;
grant execute on function private.planning_absence_reviewer_ids_impl() to authenticated;

create function public.planning_absence_reviewer_ids()
returns table(user_id uuid)
language sql
stable
security invoker
set search_path=''
as $$
  select * from private.planning_absence_reviewer_ids_impl();
$$;

revoke all on function public.planning_absence_reviewer_ids() from public, anon;
grant execute on function public.planning_absence_reviewer_ids() to authenticated;
