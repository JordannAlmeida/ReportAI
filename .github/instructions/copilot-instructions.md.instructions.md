# Copilot Instructions

These are coding guidelines and architectural preferences for this project, which consists of:

- **Backend:** API in Go (Golang)
- **Frontend:** React (TypeScript using Vite)

Copilot should follow these rules when generating code.

---

## 1. General Project Rules

- Use **clear, self-explanatory variable names**.
- Avoid unnecessary **comments** to explain functions or lines.
- Follow **idiomatic Go and React best practices**.
- Prefer **small, reusable functions**.
- Do **not** hardcode credentials or secrets. Use environment variables instead.

---

## 2. Backend (Go API)

**Framework / Tools**
- Use **net/http** and **gorilla/mux** for routing.
- Use **encoding/json** for JSON serialization/deserialization.
- Store configuration in `.env` using `github.com/joho/godotenv`.
- Use **Go modules** (`go.mod`) for dependencies.

**Structure**
```

backend/
├── api/             # Private application code (cannot be imported outside module)
│   ├── config/            # Configuration loading (env, files)
│   ├── server/            # HTTP server setup & middleware
│   ├── handler/           # HTTP handlers (controllers)
│   ├── service/           # Business logic layer
│   ├── repository/        # Data access (DB, cache)
│   ├── model/             # Structs for domain entities
│   ├── middleware/        # Auth, logging, rate limiting
│   ├── go.mod
│   ├── main.go              # Entry point
│   └── go.sum
├── pkg/                   # Publicly reusable packages (optional)
├── migrations/            # DB migrations (SQL)
├── scripts/               # DevOps, build, deploy scripts
├── .env                   # Environment variables



````

**Guidelines**
cmd/ → Holds your main application(s). Each subfolder is a runnable binary.
internal/ → Keeps code private to your module so no other projects import it accidentally.
handler/ → Contains the HTTP endpoints. Only translates HTTP requests/responses, no business logic here.
service/ → Business logic layer, independent of HTTP, database, etc.
repository/ → Database or storage logic (Postgres, Redis, etc.).
model/ → Struct definitions for requests, responses, and domain entities.
middleware/ → Cross-cutting concerns like logging, auth, CORS.
pkg/ → Utility packages you could reuse in other projects.
api/ → API specifications for docs or codegen (Swagger/OpenAPI/Protobuf).
````

---

## 3. Frontend (React)

**Framework / Tools**

* Use **React 18+** with functional components.
* Use **React Router** for navigation.
* Use **axios** for API calls.
* State management: **React Context API**
* Styling: **Tailwind CSS** or CSS Modules.

**Structure**

```
frontend/
src/
│
├── assets/              # Static files (images, fonts, icons, global styles)
│   ├── images/
│   ├── fonts/
│   └── styles/          # Global CSS/SCSS/Tailwind config
│
├── components/          # Reusable UI components
│   ├── ui/              # Low-level components (buttons, inputs, modals, etc.)
│   └── layout/          # Layout wrappers (header, footer, sidebar)
│
├── features/            # Feature-based modules (self-contained)
│   ├── auth/            # Authentication logic (pages, components, hooks, services)
│   ├── dashboard/
│   └── ...
│
├── hooks/               # Custom React hooks (useFetch, useDebounce, etc.)
│
├── lib/                 # Configurations, API clients, utility libraries
│   ├── api/             # API calls grouped by domain
│   ├── config/          # App configuration constants
│   ├── utils/           # Generic helper functions
│   └── validations/     # Zod/Yup schemas
│
├── pages/               # Page-level components (route endpoints)
│   ├── Home/
│   ├── Login/
│   └── NotFound/
│
├── providers/           # Context providers (AuthProvider, ThemeProvider, etc.)
│
├── routes/              # Routing configuration (React Router)
│
├── store/               # State management (Zustand, Redux, Jotai, etc.)
│
├── types/               # Global TypeScript types/interfaces
│
├── App.tsx              # Main app component
├── main.tsx             # Entry point (Vite mount point)
└── vite-env.d.ts        # Vite's type declarations

---

## 5. Naming & Style

* Go: `PascalCase` for exported, `camelCase` for internal.
* React: Component names in `PascalCase`, props in `camelCase`.
* Always lint before committing.

---

## 6. Migrations

All migrations needs to be incremental, like "001_CREATE_TABLES.sql". Also they need to be idempotent, meaning running them multiple times won't cause errors. They needs use commit and rollback statements to ensure consistency.