# 🚀 HiredToBe

> _“Because you’re not just applying. You’re **HiredToBe**.”_

## Full Description

Job hunting is exhausting. You apply to dozens of roles, only to get ghosted. You finally get an interview, but the rounds keep multiplying. You wait weeks for an offer, only to hear _“our manager is out, we’ll get back to you”_. The process is messy, demotivating, and hard to track.

**HiredToBe** is here to make that journey a little easier (and fun).

It’s your personal **career companion app** — helping you:

- **Track applications**: Keep all your job details, recruiter contacts, and documents in one place.
- **Stay on top of interviews**: Schedule rounds, sync with Google Calendar, and jot down notes + feedback.
- **Visualize progress**: Use a Kanban board to see where each application stands.
- **Compare offers**: Put offers side by side and see which one really works for you.
- **Stay motivated**: Turn the chaotic job hunt into a structured, gamified journey.

Instead of drowning in emails, spreadsheets, and sticky notes, **HiredToBe** gives you clarity and control. It’s not just about tracking jobs — it’s about keeping your head up through the rejections, the ghosting, and the endless waiting, so you can focus on what matters: landing the role you’re meant to be.

The first public milestone release of **HiredToBe**, a job-hunt tracker that helps you stay organized, motivated, and one step closer to your next offer.  
This MVP focuses on delivering the **core authentication** and **job/organization management features** essential to the experience.

## Features

### Authentication

- **Google OAuth login** via Supabase
- **Short-lived cookie sessions (~1h)** for secure access
- **Logout** flow implemented for clean session handling

### Job Management

- **CRUD operations** for Jobs  
  Create, edit, and delete job entries with essential details.
- **Update Job Status** to track progress (Applied → Interview → Offer → Hired)
- **Attach Documents (links only)** to jobs
- **Connect Jobs to Organizations**

### Organization Management

- **CRUD for Organizations**
- **Attach Organizations** to jobs
- Organization details page showing associated **jobs** and **connections**

### Details Pages

- **Job Details Page**
  - Displays **interviews**, **notes**, **docs**, and **connections**
- **Organization Details Page**
  - Shows related **jobs** and **connections**

## Improvements & Under the Hood

- Added **query invalidation logic** to keep data in sync after mutations
- Modularized components for cleaner code and easier scaling
- Improved **data models** for jobs, organizations, and docs
- Consistent **UI layout and structure** for better UX

## 🛠️ Tech Stack

- **Next.js 14 + Supabase**
- **TanStack Query**
- **TailwindCSS + ShadCN UI**
- **Google OAuth 2.0**
- Hosted on **Vercel (serverless)**

## Coming Next (v1 Roadmap)

- 🗂️ **Kanban view** for job stages
- 🗓️ **Interview scheduling & calendar integration**
- ⚖️ **Offer comparison** module
- 🧭 **Dashboard** with analytics and insights
- 🔄 **Persistent sessions / refresh tokens**

## ❤️ A Note from the Dev

This version marks the foundation of **HiredToBe** — the start of something that makes job hunting feel _less chaotic_ and a bit more _in control_.  
Stay tuned — v1 will bring visualization, structure, and motivation to your job journey!

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your Ubuntu system.

### Prerequisites

You will need the following installed:

* **Node.js** (v20+ recommended)
* **pnpm** (as indicated by `pnpm-workspace.yaml`)
* **Wrangler CLI** (Cloudflare's command-line tool, used for D1 local development)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/kushagra-aa/hired-to-be.git
    cd hired-to-be
    ```

2. **Install Dependencies**
    Use pnpm to install all dependencies across the monorepo:

    ```bash
    pnpm install
    ```

3. **Configure Environment Variables**
    Create a local environment file by copying the example:

    ```bash
    cp .dev.vars.example .dev.vars
    ```

    Populate the variables in the newly created `.dev.vars` file. This file is used by `wrangler dev` for local development.

## 🗄️ Database Setup (Cloudflare D1 & Drizzle)

The Cloudflare D1 database is emulated locally using a SQLite file managed by Wrangler/Miniflare. Drizzle ORM is used for schema and migrations.

### 1\. Run Migrations

To set up your local database schema, apply all Drizzle migrations using the `wrangler` command with the `--local` flag.

```bash
pnpm db:migrate:local
```

| Script Command | Description |
| :--- | :--- |
| `pnpm db:generate` | Generates a new Drizzle migration file from your schema. |
| `pnpm db:migrate:dev` | Applies pending migrations to the **local dev** D1 instance. |
| `pnpm db:migrate:remote` | Applies pending migrations to the **remote (production)** D1 instance. *(Requires Cloudflare login)* |

## 🛠️ Local Development

### Server

To run the Hono application locally and connect to the mock D1 database:

```bash
pnpm dev:server
```

This command runs `wrangler dev`, which:

1. Starts a local backaned server (usually on `http://localhost:8000`).
2. Loads your environment variables from `.dev.vars`.
3. Initializes the local D1 SQLite database from the `.wrangler/` state folder.

### Client

To run the React application locally and connect to the local server:

```bash
pnpm dev:client
```

This command runs `vite`, which:

1. Starts a local frontend server (usually on `http://localhost:3000`).
2. Connects to the dev backend using proxy (usually on `http://localhost:3000/api`).

## 📦 Monorepo Structure

The project is structured as a pnpm workspace with a focus on separate application and shared package logic.

```
.
├── apps/
│   ├── client/                 # Frontend application (React Vite)
│   └── server/                 # Hono API (Cloudflare Worker)
│       └── src/                # Core server logic, routes, and controllers
│       └──drizzle.config.ts    # Drizzle configuration for schema and migrations
├── packages/                   # Shared packages (e.g., Types, utility functions)
├── migrations/                 # Drizzle migraetion files
└── wrangler.toml               # Cloudflare Worker and D1 binding configuration
```

## 🌐 Deployment

To deploy the application to Cloudflare Workers:

1. Ensure your `wrangler.toml` has the correct `database_id` and `database_name` for your remote D1 instance.
2. Deploy the code:

    ```bash
    pnpm deploy
    ```

3. If you have new migrations, apply them to the remote database:

    ```bash
    pnpm db:migrate:remote
    ```