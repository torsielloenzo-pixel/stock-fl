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
