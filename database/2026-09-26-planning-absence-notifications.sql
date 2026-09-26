-- Autorise les notifications liées aux demandes de congés sans exiger
-- la permission complète de gestion du planning.

drop policy if exists "planning notifications permission insert" on public.planning_notifications;

create policy "planning notifications permission insert"
on public.planning_notifications
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and (
    private.can_module((select auth.uid()), 'planning', 'manage')
    or (
      kind = 'absence_request'
      and private.planning_absence_permission((select auth.uid())) in ('request','manage')
      and private.planning_absence_permission(user_id) = 'manage'
    )
    or (
      kind = 'absence_decision'
      and private.planning_absence_permission((select auth.uid())) = 'manage'
    )
  )
);
