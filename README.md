# ORÉNYS

Le début de tout ce que tu peux devenir.

ORÉNYS est une plateforme d’accompagnement pour les personnes qui veulent entreprendre, créer une activité ou concrétiser une idée. L’objectif est de rassembler outils, ressources, méthodes et accompagnement, pour passer d’une envie à un projet structuré, puis à une activité durable.

L’idée centrale : ne pas seulement aider à créer une entreprise, mais accompagner une personne dans la réalisation de son projet. Le parcours est progressif, personnalisé et centralisé, depuis les premières réflexions jusqu’au développement de l’activité.

La plateforme s’organise autour de trois piliers :

- **Connaissance de soi** — compétences, forces, motivations, contraintes et ressources, pour choisir une direction cohérente.
- **Construction du projet** — offre, clients, proposition de valeur, marché, positionnement, modèle économique et lancement.
- **Outils pratiques** — diagnostics, documents, études de marché, business models, simulations financières, prix et rentabilité.

Chaque utilisateur dispose d’un espace personnel pour construire son projet et suivre sa progression. Le détail du positionnement est dans [`docs/resume-commercial.md`](docs/resume-commercial.md).

## Ce dépôt

Socle local de la plateforme : compte, session et navigation.

Monorepo pnpm. L’interface est une application React (Vite). L’API est NestJS, avec Prisma et PostgreSQL. Le paquet `@orenys/domain` porte les règles partagées entre les deux.

## Prérequis

- Node.js 22 ou plus
- pnpm 11.11 (déclaré dans `package.json`, via Corepack)
- Docker, optionnel : sans lui, `pnpm db:up` démarre un PostgreSQL embarqué

## Démarrage

```bash
pnpm install
pnpm db:up
pnpm db:migrate
pnpm dev
```

`pnpm db:up` reste ouvert : il tient PostgreSQL en vie. Dans un autre terminal, enchaîne avec la migration puis `pnpm dev`.

| Service | Adresse |
| --- | --- |
| Application | http://localhost:5173 |
| API (Swagger) | http://localhost:3000/api/docs |

La configuration se lit depuis `.env` à la racine (fichier ignoré par git). Variables attendues par l’API : `DATABASE_URL`, `ACCESS_TOKEN_SECRET` (32 caractères minimum), et en option `ACCESS_TOKEN_TTL_SECONDS`, `REFRESH_TOKEN_TTL_DAYS`, `COOKIE_SECURE`, `PORT`, `WEB_ORIGIN`, `WEB_DIST_DIR`.

## Base de données

`pnpm db:up` utilise Docker Compose s’il est installé, sinon un PostgreSQL embarqué dans le dossier `.orenys` du profil utilisateur.

Le port local est **5433**. Les bases `orenys` et `orenys_test` partagent l’utilisateur local `orenys`. Les identifiants de développement sont ceux de `docker-compose.yml` et du script `scripts/dev-postgres.mjs`.

`pnpm db:migrate` applique les migrations Prisma (`prisma migrate deploy` dans `apps/api`).

## Scripts

| Commande | Rôle |
| --- | --- |
| `pnpm dev` | Compile `@orenys/domain`, puis lance l’API et le front en parallèle |
| `pnpm build` | Build de production des paquets |
| `pnpm test` | Migre la base de test, puis lance les tests des paquets |
| `pnpm lint` | ESLint sur le dépôt |
| `pnpm typecheck` | Vérification TypeScript |
| `pnpm db:up` | PostgreSQL local (processus bloquant) |
| `pnpm db:migrate` | Applique les migrations |

## Arborescence

```text
apps/api          API NestJS, Prisma, auth
apps/web          Application React
packages/domain   Règles et types partagés
packages/ui       Composants d’interface
packages/config   Configuration partagée
docs/             Documentation produit
docker/           Init SQL pour Compose
scripts/          PostgreSQL de dev et migration de test
```

L’image Docker (`Dockerfile`) construit le front et l’API, puis sert l’application en production sur le port 8000.
