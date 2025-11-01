## Quick context

- Monorepo with two main apps:
  - `frontend/` — React + TypeScript + Vite app (dev: `npm run dev`, build: `npm run build`). See `frontend/package.json` and `frontend/vite.config.ts`.
  - `ecommerce/` — Spring Boot (Java 21) backend built with Maven. Use the included wrapper (`ecommerce/mvnw` or on Windows `ecommerce/mvnw.cmd`). See `ecommerce/pom.xml`.

## Contracts & important patterns

- Backend API convention: responses are wrapped in an `ApiResponse<T>` shape (client unwraps `success` / `data` / `error`). Frontend unwrapping lives in `frontend/src/lib/api/client.ts`.
- Frontend -> backend base path is proxied by Vite: `frontend/vite.config.ts` proxies `/api` -> `http://localhost:8080`. Frontend uses `API_BASE_URL = '/api'` in `frontend/src/lib/api/client.ts`.
- Auth / tokens:
  - Access / refresh tokens stored in localStorage keys: `access_token`, `refresh_token` (see `tokenManager` in `frontend/src/lib/api/client.ts`).
  - Refresh flow: client posts to `/auth/refresh-token`. Interceptor queuing logic is implemented in `client.ts` — reuse it when adding new API calls that require auth.
  - Auth API endpoints: `/auth/login`, `/auth/register`, `/auth/me`, `/auth/refresh-token` (see `frontend/src/lib/api/auth.api.ts`).
- State & fetching patterns:
  - React Query (`@tanstack/react-query`) is used for server state — see `frontend/src/lib/hooks/*` (example: `useProducts.ts`).
  - Local auth state uses `zustand` with `persist` (`frontend/src/lib/stores/authStore.ts`). Persist config name: `auth-storage`.

## How to run locally

1. Start backend (Windows):

   - Open PowerShell in repo root:
     - cd `ecommerce`
     - `mvnw.cmd spring-boot:run` (or `mvnw.cmd -DskipTests package` to build)

2. Start frontend:

   - Open a second terminal, cd `frontend`
   - `npm install` (first time) then `npm run dev` (defaults to port 3000). The Vite proxy forwards `/api` to `localhost:8080`.

Notes: backend expects Java 21 (see `ecommerce/pom.xml` property `<java.version>`). If you run frontend without the proxy, enable CORS on the backend or set a different base URL in `frontend/src/lib/api/client.ts`.

## Developer conventions to follow

- API changes: backend uses an `ApiResponse` wrapper. If you modify response shape, update the unwrapping logic in `frontend/src/lib/api/client.ts` and corresponding TypeScript types in `frontend/src/lib/types`.
- Error messages: `handleApiError` in `client.ts` centralizes user-friendly messaging — reuse it in new UI actions.
- Queries: use `queryClient` keys from `frontend/src/lib/queryClient.ts` and prefer `useQuery` / `useMutation` helpers in `frontend/src/lib/hooks/` rather than ad-hoc fetches.
- Auth flow: rely on `useAuthStore` for login/logout/load-user flows; prefer store methods over direct token manipulation.

## Integration points & hotspots

- Vite proxy config: `frontend/vite.config.ts` — change only if backend port or host changes.
- Axios client: `frontend/src/lib/api/client.ts` — central point for request/response interception, refresh token logic, and error unwrapping.
- Backend properties: `ecommerce/src/main/resources/application*.yml` — runtime profiles (dev/test/prod) are configured here.
- OpenAPI: springdoc is included (`springdoc-openapi-starter-webmvc-ui` in `pom.xml`) — backend exposes Swagger UI at `/swagger-ui.html` when running.

## Quick examples

- Calling a protected API from frontend:
  - Use `apiClient.get('/orders')` or the thin wrappers in `frontend/src/lib/api/*.api.ts`.
  - Errors are already normalized to strings by `handleApiError(error)`.

- Updating token handling:
  - If backend changes refresh contract, update `/auth/refresh-token` usage in `client.ts` and the `tokenManager` keys.

## When to ask for guidance

- If you change the API response envelope (remove `success`/`data`), tell maintainers — many UI helpers depend on that.
- If you upgrade Java/Spring/Maven versions — verify `mvnw` and the `pom.xml` properties and update CI if present.

---
If anything above is unclear or you want more detail (CI, Docker, or deployment notes), tell me which area to expand and I’ll update this file.
