# Folder Structure

```
src
├── boot.flux                 # App bootstrap
├── configs                   # App-wide configs (db, cache, etc.)
└── modules
    └── <module_name>
        ├── controllers       # Request handling
        ├── services          # Business logic
        ├── models            # Database models
        ├── middlewares       # Module-specific middleware
        ├── validators        # Request validation schemas
        ├── policies          # Authorization rules
        ├── events            # Domain events (publish/subscribe)
        ├── jobs              # Background jobs / queues
        ├── locales
        │   └── <locale>
        │       └── <file_name>.json
        ├── migrations
        ├── seeders
        ├── routes
        └── tests             # Unit/integration tests for this module
```