*This project has been created as part of the 42 curriculum by **clalopez** ([**Clxxdxx** on github.com](https://github.com/Clxxdxx)), **smarin-s** ([**DeewaGG** on github.com](https://github.com/DeewaGG)), **gamorcil** ([**Byte206** on github.com](https://github.com/Byte206)), and **Amonteag** ([**CressDev** on github.com](https://github.com/CressDev)).*

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Clxxdxx">
        <img src="https://github.com/Clxxdxx.png" width="80" style="border-radius:10%"><br/>
        <sub><b>clalopez</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/DeewaGG">
        <img src="https://github.com/DeewaGG.png" width="80" style="border-radius:10%"><br/>
        <sub><b>smarin-s</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Byte206">
        <img src="https://github.com/Byte206.png" width="80" style="border-radius:10%"><br/>
        <sub><b>gamorcil</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/CressDev">
        <img src="https://github.com/CressDev.png" width="80" style="border-radius:10%"><br/>
        <sub><b>Amonteag</b></sub>
      </a>
    </td>
  </tr>
</table>

# Transcendence

## Description

**Transcendence** is a real-time, multiplayer web arcade built for the 42 `ft_transcendence` project. It brings together a small collection of classic browser minigames — **Pong**, **Tic-Tac-Toe**, **Connect 4** (with an AI opponent), **Wordle**, **Guess Card**, and **Arkanoid** — under a single account system, so a player can register once, play any of the games, and see their progress reflected in a shared leaderboard.

The goal of the project was to design and ship a complete, containerized, multi-service web application as a team: a secure user/authentication system, several playable games with persisted results, a global chat, and a production-style observability stack (centralized logging, health checks, automated backups) — all reachable behind a single HTTPS entrypoint and started with one command.

Key features:
- Account registration/login with hashed passwords and email-based password recovery (verification code by e-mail).
- Six playable minigames, each recording wins/losses per user.
- A Connect 4 AI opponent.
- Global leaderboard, per-user stats, and recent match activity feed.
- Real-time global chat over WebSockets.
- Centralized logging with the ELK stack (Elasticsearch, Logstash, Kibana), plus a health-check endpoint/status page and scheduled automated backups.
- Everything served over HTTPS through a single Nginx reverse proxy, started with `make`.

## Team Information

> Roles below follow the 42 subject's required team roles (PO, PM, Tech Lead, Developer) and can be combined on a 4-person team.

| 42 login | GitHub | Role(s) | Responsibilities |
|---|---|---|---|
| `clalopez` | [Clxxdxx](https://github.com/Clxxdxx) | Tech Lead + Developer | Backend architecture and Laravel setup, authentication (login/logout, password recovery by e-mail), core Eloquent models, user/game/leaderboard/stats endpoints, terms & conditions and leaderboard/profile UI, Docker Compose fixes and Makefile maintenance. |
| `smarin-s` | [DeewaGG](https://github.com/DeewaGG) | Project Manager (PM) + Developer | Frontend game implementations (Pong, Tic-Tac-Toe, Guess Card, Wordle, Arkanoid), profile screen, points/scoring system and minigame balancing, Nginx reverse-proxy configuration, Docker Compose service wiring. |
| `gamorcil` | [Byte206](https://github.com/Byte206) | Developer | Connect 4 game and its AI opponent. |
| `Amonteag` | [CressDev](https://github.com/CressDev) | Product Owner (PO) + Developer | DevOps: ELK logging stack (Elasticsearch/Logstash/Kibana), health-check endpoint and status page, automated backup/restore commands, chat WebSocket server, security hardening notes. |

_Role assignment above is inferred from each person's scope of ownership in the codebase: `clalopez` owns the backend architecture and merged the majority of feature branches into `main` (Tech Lead); `smarin-s` and `Amonteag` each own a full cross-cutting track (frontend/games and DevOps respectively) touching infra shared by the whole team (PM/PO); `gamorcil` contributed a single, well-scoped feature (Developer). PO/PM duties like backlog grooming and stakeholder communication aren't visible in commit history, so confirm or adjust this with your team before submitting._

## Project Management

- **Task organization:** work was split by area (backend/API, frontend/games, DevOps/observability) and tracked through GitHub (branches + pull requests, see `git log` for the merge history of features such as `feat/connect-four-vs-ia`, `feat/chat-top-scorers`, `feat/design-leaderboard-profile`, `logs`/`devopsmoduleminor`).
- **Communication:** the team coordinated over WhatsApp for day-to-day communication and met in person regularly to sync progress and unblock each other.
- **Code review:** feature branches were merged back into `main` through pull requests rather than direct pushes.

_Feel free to expand this section with your actual meeting cadence (e.g. weekly sync) and any backlog/board tool if you used one beyond GitHub._

## Technical Stack

**Frontend**
- [Angular 21](https://angular.dev/) (standalone components) with TypeScript.
- [Tailwind CSS 4](https://tailwindcss.com/) for styling (satisfies the mandatory CSS-framework requirement).
- Vitest for unit tests (`*.spec.ts` files alongside each component/service).

**Backend**
- [Laravel 12](https://laravel.com/) (PHP) as the backend framework, serving a REST-style JSON API.
- [Laravel Sanctum](https://laravel.com/docs/sanctum) for API token authentication.
- A lightweight Node.js (`ws`) WebSocket server (`chat/server.js`) dedicated to the real-time global chat, proxied by Nginx at `/api/chat-socket`.

**Database**
- **MariaDB 10.11**, chosen for its drop-in MySQL compatibility, first-class support in Laravel's Eloquent ORM, and easy containerization alongside the rest of the stack. Managed in development through the bundled **phpMyAdmin** service.

**Infrastructure / DevOps**
- **Docker Compose** orchestrates seven services: `db` (MariaDB), `backend` (Laravel/PHP-FPM), `frontend` (Angular dev server), `nginx` (reverse proxy/TLS termination), `phpmyadmin`, `chat-server` (WebSocket chat), and `scheduler` (Laravel task scheduler for backups).
- **Nginx** terminates HTTPS (self-signed cert for development) and reverse-proxies to the frontend, the PHP backend, the chat WebSocket server, and Kibana (behind HTTP Basic Auth).
- **ELK stack** (Elasticsearch, Logstash, Kibana 8.10.2) for centralized, structured application logging with an ILM retention policy.
- A `php artisan backup:run` / `backup:restore` command pair (scheduled every 6 hours) archives `storage/app/public` and the database (including a `mysqldump` when running on MySQL/MariaDB) for disaster recovery.

**Why this stack:** Laravel and Angular were chosen so the team could split cleanly into a backend/API track and a frontend/games track while each side keeps a full, opinionated framework (routing, ORM, DI, CLI tooling on the Laravel side; components, router, forms on the Angular side). MariaDB was picked over SQLite for concurrent-write safety once real-time multiplayer usage was expected, while staying wire-compatible with the rest of the MySQL-oriented Laravel ecosystem.

## Database Schema

An entity-relationship diagram is included at the repository root: [`Entidad-Relacion Transcendence.png`](./Entidad-Relacion%20Transcendence.png).

Core tables (see `backend/database/migrations/`):

| Table | Key fields | Purpose / relationships |
|---|---|---|
| `users` | `id_user` (PK), `name`, `email` (unique), `nick` (unique), `password` (hashed), `registration_date`, `points` | Application accounts. Referenced by `stats`, `messages`, `matches.id_winner`, `match_user`. |
| `games` | `id_game` (PK), `name` (unique) | Catalog of the 6 minigames (Tic-Tac-Toe, Wordle, Pong, Guess Card, Arkanoid, Connect 4). |
| `stats` | `id_stat` (PK), `wins`, `losses`, `id_user` (FK → `users`), `id_game` (FK → `games`) | Per-user, per-game win/loss counters, cascades on user/game deletion. |
| `matches` | `id_match` (PK), `init_date`, `end_date`, `id_game` (FK → `games`), `id_winner` (nullable FK → `users`) | One row per played match. |
| `match_user` | `id_match_user` (PK), `date`, `points`, `id_match` (FK → `matches`), `id_user` (FK → `users`) | Join table recording each participant's result/points for a match (feeds the "recent activity" feed). |
| `channels` | `id_channel` (PK), `name` | Chat channels. |
| `messages` | `id_message` (PK), `content`, `sent_date`, `id_user` (FK → `users`), `id_channel` (FK → `channels`) | Chat messages, cascades on user/channel deletion. |
| `personal_access_tokens` | Sanctum-managed | API auth tokens for logged-in users. |

Relationships in short: a `user` has many `stats` (one per `game` played), participates in many `matches` through `match_user`, can `win` a `match`, and can post `messages` into `channels`.

## Instructions

### Prerequisites

- Docker Engine + Docker Compose (v2 `docker compose` or legacy `docker-compose`, the `Makefile` auto-detects either).
- `make`.
- A backend environment file: copy `backend/.env.example` to `backend/.env`. The example ships with Laravel/SQLite defaults for local tooling, but **running the project via `make` uses MariaDB and Kibana**, so make sure `backend/.env` also defines (not present in the shipped example — add them):
  ```
  DB_CONNECTION=mysql
  DB_HOST=db
  DB_PORT=3306
  DB_DATABASE=transcendence
  DB_USERNAME=<your_db_user>
  DB_PASSWORD=<your_db_password>

  KIBANA_USER=<kibana_admin_user>
  KIBANA_PASS=<kibana_admin_password>
  ```
  Also set `APP_KEY` (generated automatically the first time the backend container runs `php artisan key:generate`, or run `make install`) and configure `MAIL_*` if you want password-recovery e-mails to actually send.

### Running the project

Everything is started with a single command from the repository root:

```bash
make
```

This will:
1. Generate the Kibana HTTP Basic-Auth credentials file from `KIBANA_USER`/`KIBANA_PASS` in `backend/.env`.
2. Build and start every service (`db`, `backend`, `frontend`, `nginx`, `phpmyadmin`, `chat-server`, `scheduler`).
3. Run database migrations (and seed the `games` table on first run).
4. Bootstrap the ELK indices, ILM policy, and Kibana index pattern.

Once it's up:

| Service | URL |
|---|---|
| App (through Nginx, HTTPS) | https://localhost:8443/ |
| App (through Nginx, HTTP → redirects to HTTPS) | http://localhost:8080/ |
| Kibana (behind Basic Auth) | https://localhost:8443/kibana/ |
| phpMyAdmin | http://localhost:8081/ |
| Backend (direct, PHP-FPM via Nginx only in practice) | http://localhost:8000/ |

> Do **not** use `http://localhost:4200/` to test login/signup — that's the raw Angular dev server without the `/api` proxy, so API calls will 404. It's only useful for hot-reloading UI changes.

Other useful Makefile targets:

```bash
make down     # stop all containers
make clean    # stop containers and remove volumes/orphan networks
make migrate  # (re)run database migrations
make install  # composer install + key:generate inside the backend container
make logs     # tail logs for all services
make ps       # show container status
make shell-back   # shell into the backend container
make shell-front  # shell into the frontend container
```

### Running tests

```bash
cd frontend && npm test     # Angular/Vitest unit tests
cd backend && php artisan test   # PHPUnit backend tests
```

## Features List

| Feature | Description | Contributor(s) |
|---|---|---|
| Registration / login | Secure signup and login with hashed passwords, e-mail-based password recovery via a verification code | `clalopez` |
| Profile | View and edit account info (name, nickname), password change, view stats/history | `clalopez`, `smarin-s` |
| Leaderboard | Global top-players ranking by points, highlighting the current user | `clalopez` |
| Recent activity | Per-user feed of the last matches played, with result and points | `clalopez` |
| Pong | Classic 2-player Pong | `smarin-s` |
| Tic-Tac-Toe | Classic 2-player Tic-Tac-Toe | `smarin-s` |
| Connect 4 (vs AI) | Connect 4 with an AI opponent | `gamorcil` |
| Wordle | Word-guessing minigame | `smarin-s` |
| Guess Card | Memory/guessing card minigame | `smarin-s` |
| Arkanoid | Breakout-style minigame | `smarin-s` |
| Global chat | Real-time chat over WebSockets, including top-scorers display | `clalopez`, `Amonteag` |
| Health check & status page | `/api/health` JSON health check and a human-readable `/status` page | `Amonteag` |
| Automated backups | Scheduled `php artisan backup:run` (every 6h) with `backup:restore` | `Amonteag` |
| Centralized logging (ELK) | Structured Laravel logs shipped to Elasticsearch via Logstash, visualized in Kibana | `Amonteag` |
| Terms of Service / Privacy Policy | Modal accessible from the footer on every page | `clalopez` |

## Modules

The subject requires 14 points total (Major = 2 pts, Minor = 1 pt). Modules claimed by this project:

| Module | Category | Type | Points | Implementation |
|---|---|---|---|---|
| Use a framework for both frontend and backend | Web | Major | 2 | Angular (frontend) + Laravel (backend), see [Technical Stack](#technical-stack). |
| Real-time features via WebSockets | Web | Major | 2 | Dedicated Node.js `ws` server (`chat/server.js`) powering the global chat, proxied by Nginx at `/api/chat-socket`. |
| Use an ORM for the database | Web | Minor | 1 | Laravel Eloquent models (`User`, `Game`, `Stat`, `Match_`, `Match_User`, `Message`, `Channel`). |
| Game statistics and match history | User Management | Minor | 1 | `stats` table (wins/losses per user/game), `matches`/`match_user` history, leaderboard and recent-activity endpoints. |
| Introduce an AI opponent | Artificial Intelligence | Major | 2 | Connect 4 vs AI (`connect-four` component). |
| Implement a full web-based game | Games & UX | Major | 2 | Pong, playable start-to-finish with win/loss conditions. |
| Add another game with user history | Games & UX | Major | 2 | Five further games (Tic-Tac-Toe, Connect 4, Wordle, Guess Card, Arkanoid) beyond the first, all recording stats through the same `games`/`stats` schema. |
| Log management infrastructure (ELK) | DevOps | Major | 2 | Elasticsearch + Logstash + Kibana 8.10.2, ILM retention policy, Nginx Basic-Auth-protected access to Kibana. |
| Health check + status page + automated backups | DevOps | Minor | 1 | `/api/health`, `/status`, `php artisan backup:run`/`backup:restore`, scheduler container running every 6h. |
| **Total** | | | **15** | |

**Known scope limits, for honesty during evaluation:**
- The "Add another game" module here covers additional games and per-game stats, but there is no dedicated matchmaking queue — games are launched directly from the game selection screen and played locally (same device) or against the AI.
- There is no networked "remote players" module (Pong and the other games are not played over the network between two separate machines in real time) and no friends/online-status or avatar-upload system — these were consciously left out of scope in favor of the modules above.

## Individual Contributions

_Based on the project's commit history (`git shortlog`, `git log --name-only`); expand with challenges faced and how they were resolved._

- **`clalopez`** — Laravel backend architecture: Eloquent models, migrations, `AuthController`/`UserController`/`GameController`/`MailController`, Sanctum-based authentication, password-recovery flow with e-mail verification codes, leaderboard and per-user stats/recent-activity endpoints. Also implemented the terms & conditions modal, leaderboard/profile UI redesign, and fixed several Docker Compose/Makefile compatibility issues.
- **`smarin-s`** — Frontend minigames: Pong, Tic-Tac-Toe, Guess Card, Wordle, and Arkanoid, plus the win/loss modals shared across games. Built the profile screen, the points/scoring system and minigame balancing, and the Nginx reverse-proxy configuration.
- **`Amonteag`** — DevOps track: full ELK logging stack (Elasticsearch/Logstash/Kibana, ILM policy, Nginx Basic Auth in front of Kibana), the `/api/health` health check and `/status` page, the `backup:run`/`backup:restore` Artisan commands and their scheduler, the chat WebSocket server, and security hardening notes.
- **`gamorcil`** — Implemented the Connect 4 minigame together with its AI opponent.

_TODO: each member should add 2-3 sentences here about a specific challenge they hit (e.g. Docker networking between services, WebSocket proxying through Nginx, ELK index/ILM setup, AI move selection for Connect 4) and how it was solved — this is checked during evaluation._

## Resources

**Classic references**
- [Laravel Documentation](https://laravel.com/docs)
- [Angular Documentation](https://angular.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN — WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Elastic — Elasticsearch, Logstash & Kibana Guides](https://www.elastic.co/guide/index.html)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)

**AI usage**
- This `README.md` was drafted with the help of **Claude Code** (Anthropic), which read the project's source code, Docker/Nginx configuration, and Git commit history to reconstruct the technical stack, database schema, and per-contributor work breakdown; the team then reviewed and filled in the process/role details Claude Code could not infer from the code alone.
- _TODO (team): list any other AI-assisted tasks during development — e.g. scaffolding boilerplate, debugging a specific Docker/Nginx issue, drafting the ELK pipeline configuration, brainstorming the Connect 4 AI logic — and which team member used it for what. Be specific: this is checked during peer evaluation._

## Known Limitations

- No networked remote multiplayer: games are played locally on one device or against the AI.
- No friends/online-status system or avatar upload.
- Development HTTPS certificate is self-signed (browser will show a security warning on first visit — this is expected in local/evaluation environments).

## License

Educational project created for 42's Common Core curriculum. No specific license has been chosen; all rights reserved by the authors unless stated otherwise.
