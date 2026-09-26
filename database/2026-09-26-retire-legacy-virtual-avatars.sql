-- Retire les anciens avatars virtuels historiques.
-- La nouvelle personnalisation d'avatar repose sur la photo de profil + recadrage
-- et sur les cadres/accessoires actuels.

update public.reward_catalog
set active=false
where kind='avatar';

delete from public.reward_equipment
where kind='avatar';
