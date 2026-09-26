-- Permissions du widget Planning > Indisponibilités / Congés
-- Niveaux dans site_config.planning_widgets.absences : hidden | request | manage.

create or replace function private.planning_absence_permission(target_user uuid)
returns text
language sql
stable
security definer
set search_path=''
as $$
  with actor as (
    select p.role
    from public.profiles p
    where p.id = target_user
  ),
  cfg as (
    select s.value
    from public.app_settings s
    where s.key = 'site_config'
    limit 1
  ),
  raw as (
    select actor.role,
           cfg.value #> array['planning_widgets','absences',actor.role] as permission_value
    from actor
    left join cfg on true
  )
  select case
    when role = 'admin' then 'manage'
    when jsonb_typeof(permission_value) = 'string'
      and trim(both '"' from permission_value::text) in ('hidden','request','manage')
      then trim(both '"' from permission_value::text)
    when permission_value = 'false'::jsonb then 'hidden'
    else 'request'
  end
  from raw;
$$;

revoke all on function private.planning_absence_permission(uuid) from public, anon;
grant execute on function private.planning_absence_permission(uuid) to authenticated;

create or replace function public.planning_absence_reviewer_ids()
returns table(user_id uuid)
language sql
stable
security definer
set search_path=''
as $$
  select p.id
  from public.profiles p
  where private.planning_absence_permission(p.id) = 'manage';
$$;

revoke all on function public.planning_absence_reviewer_ids() from public, anon;
grant execute on function public.planning_absence_reviewer_ids() to authenticated;

drop policy if exists "planning absences create own" on public.planning_absences;
drop policy if exists "planning absences change own pending" on public.planning_absences;
drop policy if exists "planning absences managers update" on public.planning_absences;
drop policy if exists "planning absences read own or managers" on public.planning_absences;
drop policy if exists "planning absences read allowed" on public.planning_absences;

create policy "planning absences create own"
on public.planning_absences
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and private.planning_absence_permission((select auth.uid())) in ('request','manage')
);

create policy "planning absences read allowed"
on public.planning_absences
for select to authenticated
using (
  (
    user_id = (select auth.uid())
    and private.planning_absence_permission((select auth.uid())) in ('request','manage')
  )
  or private.planning_absence_permission((select auth.uid())) = 'manage'
);

create policy "planning absences change own pending"
on public.planning_absences
for update to authenticated
using (
  user_id = (select auth.uid())
  and status = 'pending'
  and private.planning_absence_permission((select auth.uid())) in ('request','manage')
)
with check (
  user_id = (select auth.uid())
  and status in ('pending','cancelled')
  and reviewed_by is null
  and reviewed_at is null
  and private.planning_absence_permission((select auth.uid())) in ('request','manage')
);

create policy "planning absences managers update"
on public.planning_absences
for update to authenticated
using (private.planning_absence_permission((select auth.uid())) = 'manage')
with check (private.planning_absence_permission((select auth.uid())) = 'manage');
