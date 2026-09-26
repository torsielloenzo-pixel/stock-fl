-- Suppression administrative des demandes Indisponibilités / Congés.
-- Seul le rôle système admin peut supprimer des lignes de planning_absences.

drop policy if exists "planning absences admin delete only" on public.planning_absences;

create policy "planning absences admin delete only"
on public.planning_absences
for delete to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  )
);
