-- Avatars de poste Nethor
-- Les anciens avatars emoji restent désactivés.
-- Les nouveaux avatars sont des assets SVG du site référencés par reward_catalog.visual.

alter table public.reward_catalog
drop constraint if exists reward_catalog_visual_check;

alter table public.reward_catalog
add constraint reward_catalog_visual_check
check (length(visual) between 1 and 20000);

update public.reward_catalog
set active=false
where kind='avatar'
  and name in ('Renard malin','Lion du rayon','Robot de service');

insert into public.reward_catalog(name,kind,visual,price,active)
values
 ('Employé magasin','avatar','assets/avatar-role-employe.svg',1,true),
 ('Responsable de rayon','avatar','assets/avatar-role-responsable.svg',1,true),
 ('Caisse / Point de vente','avatar','assets/avatar-role-caisse.svg',1,true),
 ('Réception / Stock','avatar','assets/avatar-role-stock.svg',1,true),
 ('Gérant magasin','avatar','assets/avatar-role-gerant.svg',1,true)
on conflict do nothing;
