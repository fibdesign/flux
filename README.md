<div style="display: flex; align-items: center; justify-content: center"> <img src="./logo.png" alt="logo"/> </div>
⚠️ Warning

Flux is still under active development and is not production-ready.
Things may change quickly, and breaking changes are expected.

Contributions, feedback, and testing are very welcome — if you’d like to help shape Flux, feel free to join in!
# Flux

Flux is a lightweight **domain-specific language (DSL)** for building **API-only applications**.
It is designed to be **modular, expressive, and framework-agnostic**, allowing developers to focus on business logic instead of boilerplate.

## ✨ Features

* **API-first** — built exclusively for RESTful/HTTP APIs.
* **Modular architecture** — keep code isolated by domain (controllers, services, routes, etc.).
* **Database migrations & seeders** — version-controlled schema and seed data.
* **Internationalization (i18n)** — simple JSON-based locales for multi-language support.
* **Type-safe** — strict typing for safer and more predictable code.
* **Lightweight runtime** — no heavy framework dependencies.

## 🚀 Getting Started

1. Install Flux globally or use it locally in your project.

   ```bash
   npm install -g flux-cli
   ```

2. Initialize a new project:

   ```bash
   flux new my-api
   cd my-api
   ```

3. Run the development server:

   ```bash
   flux serve
   ```

4. Apply database migrations:

   ```bash
   flux migrate
   ```

5. Seed your database (optional):

   ```bash
   flux seed
   ```

## 🧩 Modules

Modules are the heart of Flux. Each module represents a self-contained feature, with its own:

* Controllers
* Services
* Routes
* Migrations
* Seeders
* Locales

This separation makes it easy to scale and maintain large projects.

## 🛠 Commands

* `flux serve` → Start the development server
* `flux migrate` → Run database migrations
* `flux seed` → Seed the database
* `flux make:module <name>` → Create a new module
* `flux make:controller <name>` → Create a controller inside a module

## 📖 Philosophy

Flux is designed around these principles:

* **Simplicity** — no unnecessary abstractions.
* **Modularity** — everything belongs to a feature, not the core.
* **Consistency** — a unified way to define APIs, migrations, and services.
* **Flexibility** — adopt only what you need.

## 🧪 Testing

Flux supports module-level and application-level testing.
You can write unit tests for services and controllers or run end-to-end API tests.

Run tests with:

```bash
flux test
```

## 📜 License

MIT © FibDesign

# Pages

- [Folder Structure](./FOLDER_STRUCTURE.md)