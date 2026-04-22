# my-ssr-app

## Server layering

The server follows a lightweight MVC-style structure:

- `src/server/routes`: Express route definitions and middleware wiring.
- `src/server/controllers`: HTTP request/response adapters.
- `src/server/services`: Business rules, validation, and use-case logic.
- `src/server/models`: Mongoose schemas and persistence models.
- `src/client`: React views rendered through SSR and hydrated in the browser.

Keep route handlers thin. Put reusable application behavior in services, and keep persistence details inside models or service calls to models.
