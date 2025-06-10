
# ⚡ Flux Language

Flux is a lightweight, interpreted programming language designed specifically for building **API-only** applications. It combines the simplicity of PHP with the strictness of TypeScript, and is powered by a Node.js interpreter under the hood.

> **Note:** Flux is currently experimental and ideal for learning, prototyping, and minimalist API development.

---

## ✨ Features

- Simple and clean syntax
- Custom interpreter written in Node.js
- API-first design (no frontend rendering)
- Route-based HTTP server
- Built-in middleware and handler support
- `.flux` source files
- `.env` configuration support
- Custom CLI and route inspector UI

---

## 📦 Project Structure

```

my-flux-app/
│
├── main.flux               # Entry point
├── flux.json               # Project metadata
├── .env                    # Environment config
├── libs/                   # Flux libraries and core interpreter
│   └── @flux/core/         # Core modules (parser, interpreter, server, etc.)
├── commands/               # CLI commands (run, serve, etc.)
└── http.js                 # HTTP server wrapper

````

---

## 🚀 Getting Started

1. Clone the project:
   ```bash
   git clone https://github.com/your-org/flux-template.git my-api
   cd my-api
```

2. Start the server:

   ```bash
   node cli.js serve
   ```

3. View special pages:

    * [`/__flux__routes`](http://localhost:2351/__flux__routes) — shows all defined routes
    * [`/__flux__up`](http://localhost:2351/__flux__up) — basic uptime and environment info

---

## 📜 Example Code

```flux
fn hello(req:fluxReq) => string {
    return 'Hello from Flux!';
}

router.get('/hello', hello);
```

---

## ⚙️ Configuration

* **`.env`** for runtime environment values:

  ```
  PORT=3000
  NODE_ENV=development
  ```

* **`flux.json`** for project metadata:

  ```json
  {
    "name": "my-api",
    "version": "0.1.0",
    "libs": {}
  }
  ```

---

## 🔧 CLI Commands

```bash
node cli.js run        # Run the interpreter
node cli.js serve      # Start the API server
node cli.js version    # Show current version
node cli.js download   # Download core libraries
```

---

## 🧠 Why Flux?

Flux is ideal for:

* Learning how interpreters and parsers work
* Building minimalist backend APIs
* Experimenting with new language features

---

## 🛠️ Roadmap Ideas

* Static typing system
* REPL (interactive shell)
* Auth middleware
* File-based routing
* Template generator (e.g., `flux new my-api`)

---

## 📄 License

MIT License — © 2025 Bluebird & Flux contributors
