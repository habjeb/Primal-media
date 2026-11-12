# Primal Média

## Le projet

**Mission.** Apporter aux athlètes des petites organisations francophones de MMA et de grappling une couverture du niveau de celle que l’UFC ou ONE réservent aux leurs : des actus centrées sur le combattant. Cela vise les promotions professionnelles modestes (Hexagone MMA), les structures amateurs (Duel, à Albertville et Chambéry) et les autres organisations françaises plus petites.

**Pourquoi.** Chez l’UFC et ONE, profils, avant-combats et comptes rendus partent de l’athlète. Ce traitement reste rare pour les organisations francophones de taille modeste.

**Public.** Fans, athlètes, clubs et organisateurs.

**Ligne éditoriale.** Inspirée de [La Sueur](https://lasueur.com/) : titres construits autour du nom de l’athlète avec le record entre parenthèses, chapô court, et formats récurrents — « quelle heure, quelle chaîne ? », « tous les résultats », « tout ce qu’il faut savoir sur ».

**Format.** Un fil d’actualité façon réseau social : mosaïque type Instagram / YouTube, pastilles de filtre, avatars façon stories, pages athlète et organisation façon chaîne.

**Suite.** Remplacer les contenus d’exemple par de vrais sujets, alimenter les articles par une veille média quotidienne, ajouter des organisations, et développer la vidéo.

Fil d’actualité en français pour le MMA et le grappling des organisations francophones — promotions professionnelles modestes et clubs amateurs. Le site est statique (Astro), sans base de données, et se publie gratuitement sur GitHub Pages.

Les articles, athlètes, records et cartes livrés avec le dépôt portent la mention **Contenu d’exemple**. Ce sont des fictions, pour voir la mise en page. Hexagone MMA et Duel (Albertville) ont une fiche neutre : aucun résultat réel n’y est inventé.

Adresse prévue : <https://habjeb.github.io/Primal-media/>

## Lancer en local

Node.js 22 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:4321/Primal-media/](http://localhost:4321/Primal-media/). Le préfixe `/Primal-media/` est la base GitHub Pages : en local aussi, les liens passent par là.

Vérifier la version qui sera publiée :

```bash
npm run build
npm run preview
```

## Ajouter un article

Créer un fichier `src/content/articles/mon-sujet.md` (ou `.mdx`). L’identifiant public est le nom du fichier : `/actualites/mon-sujet/`. Le fil trie par `pubDate`, du plus récent au plus ancien.

```yaml
---
title: "Camille Belvane (7-2) accepte un combat en poids paille"
description: "Chapô court, deux lignes dans le fil. Le préfixe « MMA – » est ajouté par le site."
pubDate: 2026-11-12T18:30:00+01:00
author: Rédaction
category: MMA            # MMA ou Grappling
format: breve           # breve | diffusion | resultats | decryptage
section: fight          # une (À la une) ou fight (L’actu fight)
tile: landscape         # landscape (16:9) | square | portrait
spotlight: false        # true = grand bloc en tête de l’une
organisation: hexagone-mma
athletes:
  - camille-belvane
event: exemple-soiree-cage   # optionnel
tags:
  - paille
draft: false
example: false          # true affiche le badge « Contenu d’exemple »
video:                  # optionnel — badge durée + lecteur
  provider: youtube     # youtube | instagram | fichier
  id: ABCdef12345       # identifiant YouTube, ou code court Instagram
  duration: "4:12"
---
```

Formats récurrents :

- `diffusion` — « quelle heure, quelle chaîne ? ». Lier un `event` qui a un bloc `broadcast`.
- `resultats` — « tous les résultats ». Un tableau Markdown dans le corps suffit.
- `decryptage` — « tout ce qu’il faut savoir sur … ». Le titre reste centré sur l’athlète et son record, par exemple `Nom (14-2)`.

Un fichier `.mdx` peut importer un composant Astro (voir `ines-drelin-savoir.mdx`).

Vidéo :

- YouTube : `provider: youtube` et `id` (11 caractères). Le lecteur passe par `youtube-nocookie.com`.
- Instagram : `provider: instagram` et le code court du post (`instagram.com/p/CODE/`). La valeur `EXEMPLE` n’appelle aucun compte : elle montre le cadre d’attente.
- `provider: fichier` : badge de durée dans le fil, sans lecteur tiers.

## Ajouter un athlète

`src/content/athletes/prenom-nom.md`

```yaml
---
name: Camille Belvane
nickname: Crochet
record:
  wins: 7
  losses: 2
  draws: 0
weightClass: Poids paille
team: Cage Nord Exemple
country: France
discipline: MMA          # MMA ou Grappling
organisation: hexagone-mma
example: true
fights:
  - date: 2026-11-01
    opponent: Eva Blum
    opponentRecord: "5-3"
    result: Victoire     # Victoire | Défaite | Nul
    method: Décision unanime
    eventName: "EXEMPLE — Carte du rempart"
    event: exemple-carte-rempart   # optionnel, si la carte existe
    round: 3
---
```

Le corps du fichier est la bio, sous la bannière. Le record s’affiche `7-2`, ou `9-3-1` s’il y a des nuls. Les articles qui listent cet identifiant dans `athletes` remontent dans la grille de la fiche.

## Ajouter un événement

`src/content/events/ma-carte.md`

```yaml
---
title: "Soirée d’exemple"
description: "Résumé court."
date: 2026-11-28T20:00:00+01:00
city: Lyon
venue: Halle Exemple
organisation: hexagone-mma
discipline: MMA          # MMA | Grappling | Mixte
example: true
broadcast:
  when: "samedi 28 novembre 2026, 20 h 00 (heure de Paris)"
  channel: "Chaîne Exemple — diffusion fictive"
fights:
  - weightClass: Poids welter
    red: Karim Ostel
    blue: Sami Drelcourt
    redRecord: "14-2"
    blueRecord: "16-3"
    redAthlete: karim-ostel    # optionnel : lien vers la fiche
    main: true
    winner: red                # red | blue | draw — omettre si la carte est à venir
    method: Décision unanime
    round: 3
---
```

Une date future va dans « À venir », une date passée dans « Cartes passées ».

## Ajouter une organisation

`src/content/organisations/mon-org.md`

```yaml
---
name: Nom public
mark: NM                 # 1 à 3 lettres, pastille de la chaîne
kind: amateur            # professionnelle | amateur
place: Ville
description: Une phrase neutre, sans résultat.
example: false
---
```

Puis le texte de la fiche. Ne pas y inventer de résultat réel.

## Déployer sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit le site et le publie à chaque push sur `main`.

Réglage à faire **une fois** dans le dépôt GitHub :

1. **Settings → Pages → Build and deployment → Source : GitHub Actions** (pas « Deploy from a branch »).
2. Pousser `main`. L’action « Deploy to GitHub Pages » publie `https://habjeb.github.io/Primal-media/`.
3. Si GitHub demande de valider l’environnement `github-pages`, l’autoriser une fois.

`astro.config.mjs` fixe `site` sur `https://habjeb.github.io` et `base` sur `/Primal-media`. Les liens internes et les fichiers de `public/` passent par cette base. Si le dépôt est renommé, il faut changer `base`, les URL du README et `public/robots.txt`.

Fil RSS : `/Primal-media/rss.xml`. Plan de site : `/Primal-media/sitemap-index.xml`.
