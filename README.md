<!-- omit in toc -->
# Portal

<!-- omit in toc -->
## Table of Contents
- [Backend Contract Type Sync](#backend-contract-type-sync)


## Backend Contract Type Sync

This project uses generated TypeScript types from the backend OpenAPI schema.

Generate types from a locally running backend (default: `http://localhost:8000/openapi.json`):

```bash
npm run gen:api-types
```

The generated file is:

```text
src/api/backend-openapi.d.ts
```
