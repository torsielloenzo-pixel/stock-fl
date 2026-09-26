-- Correctif gestion des comptes
-- admin-manage-user utilise le client service_role pour valider les rôles dynamiques.
-- Le SELECT sur app_roles est donc requis pour les mises à jour/créations de comptes.

grant select on table public.app_roles to service_role;
