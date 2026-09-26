-- Historique du planning : lecture pour les gestionnaires des absences,
-- écriture des décisions de congés, suppression strictement réservée à l'admin.

drop policy if exists "planning logs permission delete" on public.planning_logs;
drop policy if exists "planning logs permission insert" on public.planning_logs;
drop policy if exists "planning logs permission read" on public.planning_logs;

create policy "planning logs permission read"
on public.planning_logs
for select to authenticated
using (
  private.can_module((select auth.uid()), 'planning', 'view')
  or private.planning_absence_permission((select auth.uid())) = 'manage'
);

create policy "planning logs permission insert"
on public.planning_logs
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and (
    private.can_module((select auth.uid()), 'planning', 'manage')
    or (
      action = 'absence_review'
      and private.planning_absence_permission((select auth.uid())) = 'manage'
    )
  )
);

create policy "planning logs admin delete only"
on public.planning_logs
for delete to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  )
);
