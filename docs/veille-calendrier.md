# Veille du calendrier

Procédure suivie chaque jour par la tâche planifiée « Veille calendrier » (et par toute personne qui met le calendrier à jour à la main).

## Périmètre

- **Tout ce qui se passe en France, sauf l’UFC** : galas, opens et championnats, amateurs et pros, en MMA, grappling, kick et boxe.
- Une ligue étrangère entre dans le calendrier quand elle organise une soirée en France (ex. PFL Lyon). Une soirée à l’étranger n’y entre pas, même avec des Français à l’affiche.
- Pas de contenu d’exemple : toute fiche créée par la veille a `example: false`.

## Ce que la veille fait

1. Relever, dans les sources ci-dessous, les **nouvelles dates** et les **changements** sur les dates déjà présentes dans `src/content/events/` : heure, salle, tête d’affiche, carte publiée, report, annulation.
2. Vérifier chaque information sur la meilleure source disponible : organisateur, puis salle, puis billetterie officielle, puis agenda. Un média ne suffit jamais seul.
3. Écrire ou modifier les fiches comme décrit dans le README (« Ajouter un événement », « Périmètre du calendrier ») : source et date de consultation en bas de fiche, écart entre sources signalé, `timeKnown: false` si l’heure n’est pas sûre.
4. Créer la fiche de l’organisation si elle n’existe pas (`src/content/organisations/`), en disant d’où viennent les informations.
5. Lancer `npm run build` : il doit passer sans erreur.
6. Ouvrir **une seule pull request** vers `main`, sur une branche `veille/calendrier-AAAA-MM-JJ`, avec la liste des ajouts et modifications et la source de chacun. **Ne jamais fusionner** : la relecture reste humaine.
7. S’il n’y a rien de nouveau, ne rien ouvrir.

Hors périmètre de la veille : les résultats des soirées passées (les signaler dans la pull request s’ils sont publiés), les articles, les fiches combattant.

## Règles de fiabilité

- Ne rien inventer : pas de combat, d’heure ni de salle qui ne figure pas dans une source lue.
- Ne pas recopier les textes des sources : reformuler, ne garder que les faits.
- Date ou heure en désaccord entre sources : retenir celle de l’organisateur et le dire dans la fiche.
- Soirée annulée : garder la fiche, le dire dans la description et le corps, retirer le lien de billetterie.

## Sources suivies

### Organisateurs

| Organisation | Source | Notes |
| --- | --- | --- |
| ARES Fighting Championship | https://www.aresfighting.com/events/ | Dates et heures dans le code de la page (compte à rebours). |
| Hexagone MMA | https://hexagonemma.fr/evenements/ | Onglet « À venir », liens de billetterie par date. |
| DUEL Fighting | https://duel-mma.com/ et https://billetterie.duel-mma.com/ | |
| PFL (MVP à partir de 2027) | https://pflmma.com/news | Communiqués avec carte complète et horaires. |
| Octogone MMA | https://www.jds.fr/saint-etienne/sports/octogone-mma-made-in-saint-etienne-1502491_A | Pas de site officiel trouvé. |
| Dynamite MMA | https://www.jds.fr/artistes/dynamite-mma-9641_N | Pas de site officiel trouvé. |
| Lavaur Boxing Club (Choc des Champions) | https://www.helloasso.com/associations/aamsc/evenements/gala-choc-des-champions-lll | HelloAsso refuse les lectures automatiques (403). |

### Salles

- Adidas Arena (Paris) : https://www.adidasarena.com/

### Agendas, pour repérer de nouvelles soirées

- JDS, pages organisations : `https://www.jds.fr/artistes/<organisation>_N` (ARES, Hexagone MMA, Dynamite MMA, Zodiac Fighting Championship, « Gala MMA »).

### Fédérations

- FFKMDA (kick, muay-thaï) : https://www.ffkmda.com/
- FFJDA (grappling, jiu-jitsu brésilien) : https://www.ffjudo.com/
- CFJJB (jiu-jitsu brésilien) : https://cfjjb.com/
- FFBoxe : https://www.ffboxe.com/
- IMMAF (championnats amateurs, FMMAF) : https://immaf.org/

### Médias, pour repérer seulement

ActuMMA, MMA Official, La Sueur, Dicodusport, Goatafight.

## Accès réseau

L’environnement cloud n’autorise que les hôtes listés dans ses réglages. Une source nouvelle doit y être ajoutée avant d’être lue. Bloquées en lecture automatique à ce jour : Fnac Spectacles (connexion coupée), HelloAsso et Ticketmaster (403).
