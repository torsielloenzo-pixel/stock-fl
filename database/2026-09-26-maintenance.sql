-- Maintenance performance/RLS — appliquée le 2026-09-26.
-- À conserver comme trace reproductible des changements de schéma de cette passe.

create index if not exists fl_analysis_files_uploaded_by_idx
  on public.fl_analysis_files(uploaded_by);
create index if not exists page_view_counter_resets_reset_by_idx
  on public.page_view_counter_resets(reset_by);
create index if not exists user_module_permissions_created_by_idx
  on public.user_module_permissions(created_by);

alter policy "Read products" on public.products
using (
  (select private.has_role(array['admin','responsable','lecture']))
  or (
    (select private.can_manage_fruits_legumes((select auth.uid())))
    and family_id = (select id from public.product_families where slug='fruits-legumes' limit 1)
  )
);

alter policy "Update products" on public.products
using (
  (select private.has_role(array['admin','responsable']))
  or (
    (select private.can_manage_fruits_legumes((select auth.uid())))
    and family_id = (select id from public.product_families where slug='fruits-legumes' limit 1)
  )
)
with check (
  (select private.has_role(array['admin','responsable']))
  or (
    (select private.can_manage_fruits_legumes((select auth.uid())))
    and family_id = (select id from public.product_families where slug='fruits-legumes' limit 1)
  )
);

alter policy "Read product families" on public.product_families
using (
  (select private.has_role(array['admin','responsable','lecture']))
  or ((select private.can_manage_fruits_legumes((select auth.uid()))) and slug='fruits-legumes')
);

alter policy "Read product categories" on public.product_categories
using (
  (select private.has_role(array['admin','responsable','lecture']))
  or (
    (select private.can_manage_fruits_legumes((select auth.uid())))
    and family_id = (select id from public.product_families where slug='fruits-legumes' limit 1)
  )
);

alter policy "Read product packagings" on public.product_packagings
using (
  (select private.has_role(array['admin','responsable','lecture']))
  or (select private.can_manage_fruits_legumes((select auth.uid())))
);

drop policy if exists "module permissions admin manage" on public.user_module_permissions;
drop policy if exists "module permissions admin insert" on public.user_module_permissions;
drop policy if exists "module permissions admin update" on public.user_module_permissions;
drop policy if exists "module permissions admin delete" on public.user_module_permissions;

create policy "module permissions admin insert"
on public.user_module_permissions for insert to authenticated
with check ((select private.has_role(array['admin'])));

create policy "module permissions admin update"
on public.user_module_permissions for update to authenticated
using ((select private.has_role(array['admin'])))
with check ((select private.has_role(array['admin'])));

create policy "module permissions admin delete"
on public.user_module_permissions for delete to authenticated
using ((select private.has_role(array['admin'])));


-- Correctifs de privilèges : les politiques RLS existaient mais les droits de table
-- manquaient, ce qui provoquait "permission denied" avant même l'évaluation RLS.
grant select, insert, update, delete
on table public.user_module_permissions
to authenticated;

grant select, insert, delete
on table public.fl_analysis_files
to authenticated;

grant select, insert, update, delete
on table public.user_module_permissions
to service_role;

grant select, insert, update, delete
on table public.fl_analysis_files
to service_role;


-- Les notifications internes ne doivent pointer que vers des chemins du portail.
alter table public.planning_notifications
  add constraint planning_notifications_target_url_relative
  check (
    target_url is null
    or target_url !~* '^\s*(?:[a-z][a-z0-9+.-]*:|//)'
  );


-- Réduction de la surface SECURITY DEFINER.
-- Ces RPC s'appuient désormais sur les privilèges de table + RLS existants.
alter function public.admin_delete_login_history(bigint) security invoker;
alter function public.admin_send_notification_test(uuid[], text, text, text) security invoker;
alter function public.admin_set_notification_control(uuid, boolean) security invoker;
