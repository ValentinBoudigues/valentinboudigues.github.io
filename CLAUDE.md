# Brief — Refonte du portfolio de Valentin Boudigues

> Un prototype visuel validé existe : ce brief en décrit fidèlement le design. Tout le texte est dans `src/app/data/content.ts`.
> Le brief est une base de travail, pas un cahier des charges figé : les propositions d'amélioration sont bienvenues.

## 0. Environnement

- **Angular 22**, qui demande Node ≥ 22.22 : le projet utilise **Node 24** (fichier `.node-version`, lu par `fnm`).
- Branches : `legacy-astro` = ancien site (ne pas toucher), `refonte-angular` = travail en cours, `main` = site déployé.
- Méthode de travail : suivre le skill `ub-mode`.

---

## 1. Objectif

Remplacer l'ancien portfolio Astro (2023, présenté comme étudiant de 2ᵉ année tourné vers l'IA/Python) par un site qui présente Valentin tel qu'il est aujourd'hui : **développeur Full Stack Java / Spring Boot / Angular, 3 ans d'alternance, à la recherche d'un CDI à Bordeaux**.

Cible : recruteurs et tech leads. Ils doivent comprendre en 10 secondes qui il est, ce qu'il sait faire et comment le contacter.

- Langue : **français uniquement**
- Ton : direct, concret, pas de jargon marketing
- Style : **sombre, moderne, animé**, avec un clin d'œil spatial (ancien site = thème espace)

## 2. Contraintes techniques

- **Angular (dernière version stable)**, composants standalone, signals, nouveau control flow (`@if`, `@for`), SCSS. Pas de SSR.
- **Hébergement GitHub Pages** sur le repo `ValentinBoudigues/valentinboudigues.github.io` (site utilisateur → `base-href` = `/`). Site 100 % statique : aucun backend.
- **GSAP + ScrollTrigger** (npm `gsap`) pour les animations.
- Polices embarquées via npm, pas de Google Fonts :
  - `@fontsource-variable/space-grotesk` (titres + texte)
  - `@fontsource/jetbrains-mono` (400, 500 ; labels, tags, métadonnées)
  - Les déclarer dans `angular.json > styles` (un `@use` d'un fichier `400.css` dans du SCSS casse le build).
- **Tout le contenu dans un seul fichier** `src/app/data/content.ts` (fourni) : Valentin doit pouvoir modifier un texte ou ajouter un projet sans toucher aux composants.
- Routing en mode *path* (pas de hash) + **copie de `index.html` en `404.html`** au build pour que les URL `/projets/xxx` fonctionnent au rafraîchissement sur GitHub Pages. Ajouter un fichier `.nojekyll`.
- Budgets `anyComponentStyle` à monter à 8 kB / 16 kB dans `angular.json`.

## 3. Architecture

```
src/app/
  data/content.ts           ← tout le texte (fourni)
  shared/
    gsap.ts                 ← registerPlugin(ScrollTrigger) + helper prefersReducedMotion()
    reveal.directive.ts     ← directive [appReveal] (voir §6)
    starfield.ts            ← fond étoilé canvas, fixe, derrière tout
    nav.ts
  sections/
    hero.ts / hero.scss
    parcours.ts
    projets.ts
    competences.ts
    contact.ts              ← inclut le footer
  pages/
    home.ts                 ← enchaîne les 5 sections
    project-detail.ts       ← /projets/:slug (lazy-loaded)
  app.ts                    ← <app-starfield/> <app-nav/> <router-outlet/>
```

Routes : `''` → Home, `'projets/:slug'` → ProjectDetail (lazy), `'**'` → redirect `''`.
Router : `withComponentInputBinding()` (le slug arrive en `input()`) et `withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })`. La navigation entre sections utilise `routerLink="/" fragment="parcours"` (fonctionne aussi depuis une page projet).

## 4. Design system

### Couleurs (variables CSS dans `styles.scss`)

| Variable | Valeur | Usage |
|---|---|---|
| `--bg` | `#06070c` | fond |
| `--bg-2` | `#0c0e17` | pastilles, surfaces pleines |
| `--surface` | `rgba(255,255,255,.035)` | cartes |
| `--surface-hover` | `rgba(255,255,255,.06)` | |
| `--line` | `rgba(255,255,255,.09)` | bordures, séparateurs |
| `--text` | `#eceef6` | texte principal |
| `--muted` | `#9097ad` | paragraphes |
| `--dim` | `#5d6378` | métadonnées |
| `--accent` | `#7cf5c4` | vert menthe : CTA, numéros, liens actifs, expériences pro |
| `--accent-2` | `#9d8cff` | violet : stack technique, formations |
| `--warn` | `#ffc36b` | ambre : international, encart « vibe-coding » |

`::selection` en accent, `:focus-visible` = outline 2px accent.

### Typo
- Titres : Space Grotesk, 600–700, `letter-spacing: -0.03em` à `-0.055em`, `line-height` ~1.
- Titre de section : `clamp(2.4rem, 6vw, 4.5rem)`, max 14ch, la 2ᵉ partie en `<em>` couleur `--muted` (ex. « Ce que j'ai *construit.* »).
- **Kicker** au-dessus de chaque titre : JetBrains Mono 0.8rem, majuscules, `letter-spacing .12em`, couleur accent, précédé d'un trait de 1.6rem. Format : `01 — Parcours`.
- Tags : pastilles mono 0.72rem, bordure `--line`, `border-radius: 999px`.

### Mise en page
- Conteneur `.wrap` : `min(1120px, 100% - 3rem)`.
- Sections : `padding: 8rem 0`. `scroll-padding-top: 5rem` (nav fixe).
- Rayon des cartes : 18px. Boutons en pilule (`999px`) : `.btn` (surface + bordure) et `.btn.primary` (fond accent, texte `--bg`). Au survol : `translateY(-2px)`.

## 5. Sections (dans l'ordre)

### Fond étoilé (global)
Canvas `position: fixed; inset: 0; z-index: -1`, avec deux halos en `radial-gradient` (violet en haut à droite, menthe en bas à gauche).
- Environ 1 étoile pour 4 500 px², chacune avec une profondeur `z` entre 0.2 et 1 (taille et opacité proportionnelles).
- Parallaxe à la souris (lissée) et au scroll (`scrollY * 0.12 * z`, en boucle verticale).
- Scintillement en sinus, et de rares étoiles filantes menthe (max 2 à l'écran).
- `devicePixelRatio` plafonné à 2. Boucle `requestAnimationFrame` lancée **hors zone Angular** (`NgZone.runOutsideAngular`).
- En `prefers-reduced-motion` : un seul rendu statique.

### Navigation
Fixe en haut, 4.5rem de haut. Logo « VB » suivi d'un point en accent. Liens numérotés `01 Parcours`, `02 Projets`, `03 Compétences`, `04 Contact` (numéro en mono accent). Au-delà de 30px de scroll : fond `rgba(6,7,12,.72)` + `backdrop-filter: blur(14px)` + bordure basse.
Sous 720px : burger à 2 traits qui se croisent, et menu déroulant plein écran depuis le haut.

### Hero (`#top`, `min-height: 100svh`)
Grille 1.4fr / 1fr.
- **Gauche** :
  - Badge « ● Disponible — CDI · Bordeaux » : mono, accent, fond menthe à 6 %, point avec halo pulsé.
  - Nom sur 2 lignes, `clamp(3.4rem, 11vw, 8.5rem)`. « Valentin » en plein, « Boudigues » en **contour** (`-webkit-text-stroke: 1.5px`, texte transparent). Chaque lettre dans un `<span>` pour l'animation, avec `aria-label` sur le `h1`.
  - « Développeur Full Stack / `Java · Spring Boot · Angular` » (stack en mono violet).
  - Le pitch, puis deux CTA : « Voir mes projets → » (primary) et « Me contacter ».
- **Droite** (masquée sous 900px) : « orbite ». SVG 400×400 avec 3 cercles concentriques (r 190, 130 en pointillés violets, 70) et un noyau menthe lumineux (r 26). Le SVG tourne en 90 s. Trois pastilles « Angular » (rose `#ff6b8b`), « Spring Boot » (menthe) et « Java » (ambre) orbitent à des vitesses différentes ; chaque pastille contre-rotate pour rester lisible.
- **Bas** : 3 chiffres clés séparés par une ligne (`3 ans`, `50+`, `20+ ans` + légendes, voir `stats` dans content.ts). Une colonne sous 900px.
- **Animation d'entrée** (timeline GSAP) :
  1. lettres du nom : `yPercent: 110 → 0`, stagger 0.035, `power4.out` ; chaque ligne en `overflow: hidden` ;
  2. puis badge, rôle, pitch, CTA et stats en fondu montant (stagger 0.08) ;
  3. l'orbite apparaît en `scale: .85 → 1`.
- **Au scroll** (scrub) : le `h1` monte de 18 %, l'orbite descend de 25 % et tourne de 25°.
- Ne **pas** mettre d'indicateur de scroll en bas : il chevauche les stats.

### 01 — Parcours (`#parcours`)
Titre : « De la robotique *aux SI critiques.* »
Frise verticale, ordre antichronologique (données `timeline`).
- Grille par entrée : colonne gauche de 10rem (période + type, alignés à droite, en mono), puis la carte.
- Ligne verticale entre les deux colonnes, remplie par un dégradé menthe → violet qui **se dessine au scroll** (`scaleY 0 → 1`, scrub, de `top 70%` à `bottom 70%`).
- Un point par entrée, coloré selon le type : `pro` = menthe, `formation` = violet, `international` = ambre, avec un halo. Il apparaît en `scale` avec `back.out(3)`.
- Carte : titre 1.5rem, organisme dans la couleur du type, texte en muted, puis les `bullets` éventuels (encadrés en surface, rayon 12px) et les tags.
- Animation : la méta arrive de la gauche, la carte de la droite.
- Sous 720px : ligne à gauche, méta sur une seule ligne au-dessus de la carte.

### 02 — Projets (`#projets`)
Titre « Ce que j'ai *construit.* », avec à droite un **filtre** en pilule segmentée : Tous / Perso / Robotique / École (bouton actif : fond `--text`, texte `--bg` ; `aria-pressed`).
- Grille `repeat(auto-fill, minmax(min(100%, 330px), 1fr))`.
- Carte entièrement cliquable vers `/projets/:slug`, `min-height` 300px :
  - en haut : numéro `01` (accent) et `Catégorie · année` ;
  - titre, encart `note` s'il existe, résumé, tags, flèche ↗ en bas à droite ;
  - au survol, un **halo menthe suit la souris** (variables CSS `--mx` / `--my` mises à jour au `pointermove`, `radial-gradient`), la bordure passe en accent à 35 % et la carte monte de 4px.
- L'encart `note` sert notamment pour snippet-manager. **Il est obligatoire de préciser que c'est un test de vibe-coding** fait en 2 h avec du code généré par IA. Rendu : mono ambre, bordure en pointillés, préfixe ⚡.
- Changement de filtre : les cartes réapparaissent en stagger.

### Page projet `/projets/:slug`
Lien « ← Tous les projets » (vers `/#projets`). En-tête : kicker `Catégorie · année`, titre `clamp(2.6rem, 8vw, 5.5rem)`, résumé 1.3rem, note, tags.
Corps (46rem max) : les `sections` du projet (titre en mono accent, texte 1.1rem), puis le bouton « Voir le code sur GitHub ↗ » si `repo` existe. En bas, un gros lien « Projet suivant → ».
Le `<title>` de la page est mis à jour. Un slug inconnu redirige vers l'accueil.

### 03 — Compétences (`#competences`)
Titre « Ma *boîte à outils.* ». 4 colonnes (2 sous 900px, 1 sous 520px) : un trait en haut, un titre numéroté, puis une liste dont les items sont séparés par des pointillés. Au survol d'un item : passage en `--text` et léger décalage à droite.
En dessous, pleine largeur : un **bandeau défilant infini** avec toutes les compétences, en grand (`clamp(1.6rem, 4vw, 2.6rem)`). Les mots alternent plein / contour et sont séparés par des ✦ menthe. Masque en dégradé sur les bords, défilement de 45 s.

### 04 — Contact (`#contact`)
Très grand titre « Un poste à pourvoir ? » puis, à la ligne, « Parlons-en. » en **texte dégradé** menthe → violet (`background-clip: text`).
Ensuite : la phrase d'intro, un bouton mail primary (affiche l'adresse) et un bouton « Copier l'adresse » qui affiche « Copié ✓ » pendant 2 s, puis les liens LinkedIn ↗ et GitHub ↗ en grand avec soulignement.
**Pas de numéro de téléphone.**
Footer en mono `--dim` : « © année Valentin Boudigues » à gauche, « Fait main avec Angular & GSAP » à droite.

## 6. Animations : règles générales

- Directive `[appReveal]` : `gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: 'power3.out' })` déclenchée par `ScrollTrigger` à `top 88%`, une seule fois. Entrées optionnelles :
  - `revealStagger` : anime les enfants directs en décalé ;
  - `revealDelay`, `revealY`.
- Toujours créer les animations dans `afterNextRender` et dans un `gsap.context(..., hostElement)`, puis faire `ctx.revert()` dans `ngOnDestroy` (indispensable avec le routing).
- **`prefers-reduced-motion: reduce`** : aucune animation GSAP, animations CSS coupées, `scroll-behavior: auto`. Le contenu doit être visible et complet sans JS d'animation.
- Animations CSS pures pour ce qui tourne en boucle (orbite, pulse, marquee) ; GSAP pour les entrées et le scroll.

## 7. Accessibilité et qualité

- HTML sémantique (`header`, `nav`, `main`, `section`, `ol` pour la frise, `footer`), un seul `h1` par page, éléments décoratifs en `aria-hidden`.
- Contrastes AA : `--muted` sur `--bg` est OK pour du texte courant ; `--dim` est réservé aux métadonnées.
- Navigation clavier complète, focus visible, burger avec `aria-expanded` / `aria-controls`.
- `lang="fr"`, meta description, Open Graph (titre et description), `theme-color` `#06070c`, favicon SVG « VB » avec un point menthe.
- Responsive testé à 390px, 768px et 1440px, sans scroll horizontal.
- Lighthouse visé : ≥ 95 en performance et en accessibilité.

## 8. Déploiement

Workflow `.github/workflows/deploy.yml` :
- déclencheurs : push sur `main` et `workflow_dispatch` ;
- étapes : `actions/checkout`, `actions/setup-node` (Node 22, cache npm), `npm ci`, `npx ng build` ;
- puis copie de `dist/<projet>/browser/index.html` en `404.html` et ajout de `.nojekyll` ;
- enfin `actions/upload-pages-artifact` (sur `dist/<projet>/browser`) et `actions/deploy-pages`, avec les permissions `pages: write` et `id-token: write`.

Dans les réglages du repo, mettre **Settings → Pages → Source** sur « GitHub Actions ».
Garder l'ancien site Astro sur une branche `legacy-astro` avant d'écraser `main`.

## 9. Ordre de travail suggéré pour Claude Code

1. Créer une branche `legacy-astro` avec l'ancien site, puis générer le projet Angular sur une nouvelle branche.
2. Installer gsap et les polices, poser `styles.scss` (design system) et `content.ts`.
3. Faire la nav et le starfield, puis le hero.
4. Faire le parcours, les projets avec la page détail, les compétences, puis le contact.
5. Ajouter les animations GSAP et vérifier le cas reduced-motion.
6. Mettre en place le workflow de déploiement.
7. Lancer un build de prod, tester sur mobile et desktop, passer Lighthouse.

## 10. Hors périmètre pour l'instant

- Le **contenu détaillé des projets** sera retravaillé avec Valentin projet par projet : garder les textes de `content.ts` tels quels.
- Le **bouton CV** est à ajouter quand le PDF sera prêt (`public/cv.pdf`, bouton secondaire dans le hero).
- Pas de version anglaise.
