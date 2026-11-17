// Tout le contenu du site est ici : modifier ce fichier suffit pour mettre à jour le portfolio.

export const profile = {
  name: 'Valentin Boudigues',
  firstName: 'Valentin',
  lastName: 'Boudigues',
  role: 'Développeur Full Stack',
  stack: 'Java · Spring Boot · Angular',
  location: 'Bordeaux',
  available: true,
  availability: 'Disponible — CDI',
  pitch:
    "Trois ans d'alternance sur des applications critiques du secteur public. " +
    "Je construis des interfaces rigoureuses et accessibles, et les API qui tournent derrière.",
  email: 'vboudigues@free.fr',
  github: 'https://github.com/ValentinBoudigues',
  linkedin: 'https://www.linkedin.com/in/valentin-boudigues',
  /** Fichier dans public/ ; mettre à undefined pour masquer le bouton. */
  cv: { file: 'cv.pdf', downloadName: 'CV-Valentin-Boudigues.pdf' } as { file: string; downloadName: string } | undefined,
};

export const stats = [
  { value: '3 ans', label: 'en alternance chez CDC Informatique' },
  { value: '50+', label: 'équipes branchées sur le référentiel où j’ai travaillé' },
  { value: '20+ ans', label: 'l’âge du batch que notre portail a remplacé' },
];

/** Les sections de la page d'accueil, dans l'ordre : nav, kickers et titres en découlent. */
export const sections = {
  parcours: { label: 'Parcours', title: 'De la robotique', titleEm: 'aux SI critiques.' },
  projets: { label: 'Projets', title: 'Ce que j’ai', titleEm: 'construit.' },
  competences: { label: 'Compétences', title: 'Ma', titleEm: 'boîte à outils.' },
  contact: { label: 'Contact', title: 'Un poste à pourvoir ?', titleEm: 'Parlons-en.' },
} as const;

export type SectionId = keyof typeof sections;

export const contact = {
  intro:
    'Je cherche un CDI de développeur Full Stack ou Back-end, idéalement à Bordeaux ' +
    'en mode hybride. Je réponds vite.',
};

export type TimelineKind = 'pro' | 'formation' | 'international';

/** Libellé affiché sous la période, dans la frise. */
export const timelineKinds: Record<TimelineKind, string> = {
  pro: 'Expérience',
  formation: 'Formation',
  international: 'International',
};

export interface TimelineItem {
  period: string;
  title: string;
  org: string;
  kind: TimelineKind;
  text: string;
  bullets?: string[];
  tags?: string[];
}

export const timeline: TimelineItem[] = [
  {
    period: '2023 — 2026',
    title: 'Développeur Full Stack — alternance',
    org: 'CDC Informatique · Direction des Politiques Sociales',
    kind: 'pro',
    text:
      "Trois ans au sein des équipes qui développent les applications de la Caisse des Dépôts " +
      'dans le domaine social, sur deux projets successifs.',
    bullets: [
      "Référentiel central de personnes physiques et morales pour la retraite : IHM Angular et API Spring Boot d'une brique consommée par plus de 50 équipes (API REST et Kafka). Équipe répartie entre Bordeaux et Angers.",
      "Portail pour les établissements hospitaliers : refonte d'une chaîne batch de plus de 20 ans. Les hôpitaux saisissent désormais leurs demandes de remboursement en ligne. Accessibilité au cœur du projet ; écrans récapitulatifs réalisés de bout en bout.",
    ],
    tags: ['Java', 'Spring Boot', 'Angular', 'Kafka', 'Scrum', 'Accessibilité'],
  },
  {
    period: '2024 — 2026',
    title: 'Mastère Développement Full Stack',
    org: 'Sup de Vinci',
    kind: 'formation',
    text:
      "Mémoire : comment garantir la qualité et la rigueur d'une IHM face aux exigences métier, " +
      "dans la modernisation de systèmes d'information critiques.",
  },
  {
    period: 'Avr. — Juin 2023',
    title: 'Stage de recherche',
    org: 'Université de Tsukuba · Japon',
    kind: 'international',
    text:
      'Vision par ordinateur dans un laboratoire japonais : étude des algorithmes de détection ' +
      "et de reconnaissance de la langue des signes, puis construction d'un prototype.",
    tags: ['Python', 'Computer vision'],
  },
  {
    period: 'Août 2022',
    title: 'Développeur Python',
    org: 'Caisse des Dépôts',
    kind: 'pro',
    text: 'Migration de scripts Perl vers Python.',
    tags: ['Python', 'Perl'],
  },
  {
    period: '2022',
    title: 'RoboCup 2022',
    org: 'Guimarães · Portugal',
    kind: 'international',
    text:
      "Présentation d'une nouvelle ligue, la Soccer Light League, pour laquelle on a programmé " +
      "l'IA de petits robots footballeurs.",
    tags: ['Python', 'IA', 'Robotique'],
  },
  {
    period: '2021 — 2024',
    title: 'BUT Informatique',
    org: 'IUT de Bordeaux',
    kind: 'formation',
    text: 'Classe internationale, option robotique. Alternance en 3ᵉ année.',
  },
];

export const skills = [
  {
    group: 'Front-end',
    items: ['Angular', 'TypeScript', 'RxJS', 'HTML / SCSS', 'Accessibilité web'],
  },
  {
    group: 'Back-end',
    items: ['Java', 'Spring Boot', 'API REST', 'Kafka', 'SQL'],
  },
  {
    group: 'Méthodes & outils',
    items: ['Scrum', 'Git', 'Tests unitaires', 'Linux', 'Auto-hébergement'],
  },
  {
    group: 'Aussi pratiqué',
    items: ['Python', 'C', 'Raspberry Pi', 'Arduino', 'Vision par ordinateur'],
  },
];

/** Catégories de projets, dans l'ordre des boutons du filtre. */
export const projectCategories = ['Perso', 'Robotique', 'École'] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export interface Project {
  slug: string;
  title: string;
  year: string;
  summary: string;
  tags: string[];
  category: ProjectCategory;
  /** Petit encart mis en avant sur la carte (ex : avertissement vibe-coding). */
  note?: string;
  repo?: string;
  sections: { title: string; text: string }[];
}

export const projects: Project[] = [
  {
    slug: 'homelab',
    title: 'Homelab — serveurs de jeu',
    year: '2026',
    category: 'Perso',
    summary:
      'Un mini-PC transformé en serveur maison : plusieurs serveurs de jeu gérés depuis un panel web, avec sauvegardes automatiques.',
    tags: ['Ubuntu Server', 'Pterodactyl', 'Docker', 'Réseau'],
    sections: [
      {
        title: 'Le projet',
        text: "Héberger moi-même les serveurs de jeu de mon groupe d'amis (Palworld, Valheim, Factorio) plutôt que de louer un serveur, avec un panel pour les lancer et les administrer facilement.",
      },
      {
        title: 'Ce que j’ai fait',
        text: "Installation d'Ubuntu Server 24.04 sur un HP Z2 Mini G4, déploiement du panel Pterodactyl (après avoir écarté Pelican, encore trop instable), configuration des nodes, des allocations de ports et des eggs, et planification d'une sauvegarde suivie d'un redémarrage chaque nuit.",
      },
    ],
  },
  {
    slug: 'soccer-light-league',
    title: 'Soccer Light League',
    year: '2022',
    category: 'Robotique',
    summary: "L'IA de petits robots footballeurs, présentée à la RoboCup 2022 pour lancer une nouvelle ligue.",
    tags: ['Python', 'IA', 'Travail d’équipe'],
    sections: [
      {
        title: 'Le projet',
        text: "Projet d'équipe : programmer le comportement de robots footballeurs pour une nouvelle ligue de la RoboCup.",
      },
      {
        title: 'Ce que j’ai fait',
        text: 'Les robots devaient se déplacer, tirer et défendre leur but. Le résultat a servi à présenter la ligue lors de la RoboCup 2022 à Guimarães, au Portugal.',
      },
    ],
  },
  {
    slug: 'robot-labyrinthe',
    title: 'Robot résolveur de labyrinthe',
    year: '2022',
    category: 'Robotique',
    summary: 'Un robot conçu de zéro, découpé au laser, qui trouve seul la sortie d’un labyrinthe grâce à un LiDAR.',
    tags: ['Python', 'Raspberry Pi', 'LiDAR', 'OnShape'],
    sections: [
      {
        title: 'Le projet',
        text: 'Hackathon : concevoir et fabriquer en équipe un robot capable de résoudre un labyrinthe.',
      },
      {
        title: 'Ce que j’ai fait',
        text: 'Modélisation des pièces sur OnShape, découpe laser, puis programmation en Python sur Raspberry Pi avec un LiDAR pour détecter les murs.',
      },
    ],
  },
  {
    slug: 'main-robotique',
    title: 'Main robotique',
    year: '2021',
    category: 'Robotique',
    summary: 'Une main mécanique à servomoteurs qui imite les mouvements de la vôtre, grâce à un capteur musculaire.',
    tags: ['Arduino', 'Capteurs', 'Conception mécanique'],
    sections: [
      {
        title: 'Le projet',
        text: 'Hackathon : piloter une main mécanique avec sa propre main.',
      },
      {
        title: 'Ce que j’ai fait',
        text: "Un capteur placé sur l'avant-bras détecte l'activité des muscles ; un Arduino traduit ces signaux en mouvements des servomoteurs.",
      },
    ],
  },
  {
    slug: 'bloom-filter',
    title: 'Bloom Filter',
    year: '2022',
    category: 'École',
    summary: 'Trois implémentations d’un filtre de Bloom en Java, comparées par des benchmarks.',
    tags: ['Java', 'Algorithmique', 'Tests unitaires', 'Benchmark'],
    repo: 'https://github.com/ValentinBoudigues/bloom-filter',
    sections: [
      {
        title: 'Le projet',
        text: 'Implémenter trois variantes de cette structure de données probabiliste et mesurer leurs performances.',
      },
      {
        title: 'Ce que j’ai fait',
        text: 'Développement en Java avec tests unitaires, puis analyse des temps d’exécution selon la taille du filtre, avec des graphiques générés en Python.',
      },
    ],
  },
  {
    slug: 'minishell',
    title: 'MiniShell',
    year: '2022',
    category: 'École',
    summary: 'Un shell Unix réécrit en C : exécution de commandes, built-ins et gestion des signaux.',
    tags: ['C', 'Unix', 'Signaux'],
    sections: [
      {
        title: 'Le projet',
        text: 'Recréer un shell minimal en C.',
      },
      {
        title: 'Ce que j’ai fait',
        text: 'Exécution de commandes avec ou sans arguments, commandes internes cd et exit, gestion des signaux.',
      },
    ],
  },
  {
    slug: 'snippet-manager',
    title: 'snippet-manager',
    year: '2026',
    category: 'Perso',
    summary: 'Un outil en ligne de commande pour sauvegarder, chercher et copier ses commandes favorites.',
    note: 'Test de vibe-coding — réalisé en 2 h, code généré par IA',
    tags: ['Bun', 'TypeScript', 'SQLite', 'CLI'],
    repo: 'https://github.com/ValentinBoudigues/snippet-manager',
    sections: [
      {
        title: 'Le projet',
        text: "Une expérience : voir jusqu'où on peut aller en deux heures en laissant l'IA écrire le code. Le résultat est un petit outil que j'utilise vraiment, pour ne plus fouiller l'historique du terminal.",
      },
      {
        title: 'Ce qu’il fait',
        text: 'Menu interactif dans le terminal, recherche avec copie automatique dans le presse-papier, stockage SQLite, compilé en un seul exécutable avec Bun.',
      },
    ],
  },
];
