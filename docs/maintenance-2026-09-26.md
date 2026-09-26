# Maintenance — 26 septembre 2026

## Objectif
Remettre le portail Nethor dans un état stable, maintenable et prévisible sans casser les fonctionnalités actives.

## Problèmes confirmés
- Cache PWA trop agressif : les logos pouvaient rester anciens et le JS/CSS pouvait servir une version précédente après déploiement.
- Aperçu mobile masqué par une règle responsive dans certains cas.
- Suppression des connexions dépendante de deux chemins différents (DELETE direct + RPC), avec retour utilisateur peu robuste en cas d'échec.
- `fl-assistant.html` contenait une erreur de syntaxe dans le parseur de dates.
- Dépendance Supabase JS non figée sur la plupart des pages.
- Image du module Défis & Boutique configurée vers un PNG externe d'environ 1,34 Mo alors qu'un SVG local existe.
- Trois clés étrangères sans index.
- Cinq politiques RLS réévaluaient `auth.uid()` ligne par ligne.
- Deux politiques SELECT permissives se superposaient sur `user_module_permissions`.
- Le schéma Récompenses était éclaté entre un fichier canonique et un patch déjà appliqué ; le test vérifiait encore l'ancien comportement.
- Des images produit dynamiques n'avaient pas toutes un attribut `alt`.

## Changements appliqués
- Service Worker : nouvelle génération de cache et stratégie réseau d'abord pour code/assets mutables, avec cache comme secours hors ligne.
- `profile-ui.js` : aperçu mobile fiabilisé et suppression des connexions rendue plus explicite.
- Tous les écrans concernés chargent `profile-ui.js?v=30`.
- Supabase JS figé sur `2.117.2`.
- Assistant F&L : correction de syntaxe et compilation validée.
- Récompenses : comportement actuel fusionné dans `database/rewards.sql`, test aligné, patch historique supprimé.
- SQL et documentation déplacés hors de la racine vers `database/` et `docs/`.
- RLS : expressions optimisées sans modification fonctionnelle des droits.
- Index ajoutés sur les trois clés étrangères signalées.
- Images produit : `alt` explicite, lazy loading et décodage asynchrone.
- Configuration Défis & Boutique repointée vers le SVG local.

## Décisions de prudence
- Les trois couches `design-v2.css`, `design-v3.css` et `design-v4.css` se chevauchent fortement, mais les pages ne chargent pas toutes la même combinaison. Une fusion sans test visuel navigateur complet est susceptible de modifier la cascade CSS ; elle est donc reportée à un refactor dédié.
- Les index marqués « unused » par l'auditeur Supabase ne sont pas supprimés : le projet est trop récent pour que cette statistique permette de conclure qu'ils sont inutiles.
- Le PNG Supabase devenu orphelin n'a pas été supprimé par SQL : les objets Storage doivent être supprimés via l'API Storage.

## Vérifications effectuées
- Compilation des scripts inline des écrans principaux.
- Vérification des références locales et des versions de scripts.
- Lecture des politiques RLS, privilèges de colonnes et fonctions SECURITY DEFINER.
- Relance des advisors Supabase après optimisation : les alertes RLS initplan et politiques permissives multiples sont résolues.
- Vérification que la colonne `profiles.role` n'est pas modifiable par un utilisateur standard.

## Vérification encore nécessaire après déploiement
Un passage manuel dans un vrai navigateur reste nécessaire pour confirmer les détails purement visuels et tactiles (rendu iPhone, focus, scroll, viewport, iframe de l'aperçu mobile). La validation source et backend ne remplace pas un test E2E rendu.
