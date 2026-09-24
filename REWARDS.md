# Défis et boutique — pilote administrateur

Ouvrir `rewards.html` depuis l’accueil, le menu utilisateur ou le profil.

- Administrateur : créer/modifier/dupliquer les missions, réserver pendant une heure, envoyer un compte rendu, valider ou demander une correction, acheter et équiper les objets, gérer le catalogue.
- Employé, lecture et responsable : catalogue en lecture seule et décorations visibles dans les profils et le chat. Aucune mission, aucun portefeuille ni historique accessible, aucune écriture autorisée.
- Visiteur déconnecté : connexion requise.

Le rôle est lu dans `profiles` et vérifié dans la base via `has_role`. Les fonctions restent `SECURITY INVOKER`, avec RLS sur toutes les tables. La validation et l’achat sont transactionnels, avec verrouillage et contraintes d’unicité. Aucun jeton n’est conservé dans le navigateur.

Le pilote permet volontairement à l’administrateur de valider sa propre mission pour tester le parcours complet. L’ouverture aux employés nécessitera une évolution explicite des politiques et fonctions : aucun bouton ne peut ouvrir accidentellement l’accès.

Les missions expirées restent visibles mais ne sont plus réservables. Les réservations expirées sont libérées lors de l’action suivante. Une correction rouvre la mission. Une mission validée ne peut pas être validée de nouveau. Une mission en attente doit être validée ou renvoyée pour correction avant annulation.

La boutique débute avec 15 objets (avatars emoji, cadres colorés, accessoires emoji, titres et thèmes d’accent). Un objet retiré de la vente reste utilisable par ses propriétaires. Modifier son visuel met à jour les exemplaires équipés ; son nouveau prix ne modifie pas les achats antérieurs. Un objet de chaque catégorie peut être équipé. Les thèmes modifient les accents du nouvel espace et la décoration personnelle ; ils ne remplacent pas les réglages clair/sombre du portail.

Les décorations apparaissent dans le menu utilisateur, le profil et le chat. Le classement réservé à l’admin additionne les gains du mois civil en Europe/Paris sans déduire les achats. Aucun cadeau réel, rémunération ou conversion monétaire n’est prévu.

## Vérification

`rewards-test.sql` exerce les fonctions et les permissions dans une transaction annulée. L’environnement doit contenir un administrateur, un compte lecture et un responsable. Les vérifications couvrent les gains, achats, doubles opérations, mauvais équipement, expiration, écritures directes, droits des responsables et des visiteurs. Aucun enregistrement de test n’est conservé.

La migration `rewards_admin_pilot` a été appliquée à Supabase. `rewards.sql` en conserve la définition initiale ; ne pas l’exécuter à nouveau sur la même base.

