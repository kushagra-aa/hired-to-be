# Hired To Be

A full-stack monorepo built on **Hono**, **ReactJS**, **Vite**, **Cloudflare Workers**, **Drizzle ORM**, and powered by **Cloudflare D1**.

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
