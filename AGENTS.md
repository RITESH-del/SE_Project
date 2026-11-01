# Repository Guidelines

## Project Overview

The Frontend repository is an **Academic Campus & Timetable Management Dashboard** built with **React 19, Vite 8, Redux Toolkit, Mantine v9, Tailwind CSS v4, and Recharts**.

Its primary domain is university scheduling and resource allocation:
- Monitoring classroom/room occupancy and utilization rates.
- Tracking teacher workloads and assigned classes.
- Visualizing timetable completion progress and conflict resolution (room double-bookings, faculty scheduling collisions).
- Managing campus infrastructure entities (student groups, faculty, students, rooms, courses).
- Driving dashboard composition through a **Server-Driven UI (SDUI)** engine.

---

## Architecture & Data Flow

### Architectural Pattern
The codebase follows a hybrid **Feature-Sliced / Layered** structure divided into three boundaries:
1. **Core Bootstrap (`src/app/`, `src/main.jsx`)**: Central store initialization, router mounting, and global providers.
2. **Feature Domains (`src/features/<feature>/`)**: Self-contained vertical slices (`auth`, `admin`) owning their respective pages, sub-components, state slices, thunks, and routing definitions.
3. **Shared Infrastructure (`src/shared/`)**: Cross-cutting utilities, API client, reusable UI primitives, shell layouts, and the SDUI renderer.

```
src/main.jsx (Providers: Mantine, Redux, Router)
   │
   ├── App.jsx (Root redirect: / -> /login)
   │
   ├── src/features/auth/
   │     └── routes.jsx (/login -> AuthPage)
   │
   └── src/features/admin/
         └── routes.jsx (/admin -> CommonLayout with Sidebar & Header)
               └── AdminDashBoard.jsx
                     │ (dispatches fetchDashboard thunk)
                     ▼
               adminSlice.js (stores payload.components)
                     │
                     ▼
               src/shared/sdui/Renderer.jsx (DashboardRenderer)
                     ├── Row Grid (Mantine Grid & Grid.Col)
                     ├── StatsGroup ("stats")
                     ├── PieChart ("pie-chart")
                     ├── BarChart ("bar-chart")
                     ├── SchedulingStatus ("scheduling-status")
                     └── TableSort ("table")
```

### End-to-End Data Flow
1. **Application Initialization**: `src/main.jsx` wraps `<RouterProvider router={router} />` inside Redux `<Provider store={store}>` and Mantine `<MantineProvider defaultColorScheme="dark">` with `<Suspense fallback={<Spinner />}>`.
2. **Routing & Redirection**:
   - Accessing `/` triggers programmatic navigation to `/login` via `src/App.jsx`.
   - Feature routes (`...AuthRoutes`, `...AdminRoutes`) are assembled in `src/main.jsx`.
   - Admin routes render inside `CommonLayout` (`AppShell` with dynamic breadcrumb header and collapsible sidebar).
3. **State Management & Thunks**:
   - `AdminDashBoard.jsx` dispatches `fetchDashboard()` on mount via `useEffect`.
   - `adminThunks.js` provides the SDUI schema (currently mocked locally; API call commented out).
   - `adminSlice.js` transitions `loading` and assigns `state.dashboard = action.payload.components`.
4. **Server-Driven UI (SDUI) Execution**:
   - `DashboardRenderer` in `src/shared/sdui/Renderer.jsx` iterates over the `dashboard` component array.
   - Container elements (`item.type === 'row'`) recursively instantiate a responsive Mantine `<Grid>`.
   - Leaf items are mapped to registered React components (`stats`, `pie-chart`, `bar-chart`, `progress`, `scheduling-status`, `table`) with their `item.data` passed as props.
5. **API & Authentication**:
   - Requests use `src/shared/api/apiClient.js` (Axios, `baseURL: "http://localhost:8000/api"`).
   - Request interceptors inject `Authorization: Bearer <token>` from browser `localStorage`.

---

## Key Directories

```
src/
├── app/                 # Global store configuration (store.js)
├── features/            # Domain-driven feature modules
│   ├── auth/            # Authentication domain (pages, routes, slices, thunks)
│   └── admin/           # Administrative portal domain
│       ├── components/  # Presentation widgets (BarChart, PieChart, StatsGroup, etc.)
│       ├── configs/     # Sidebar navigation schema (configs.js)
│       ├── pages/       # Admin views (AdminDashBoard.jsx)
│       ├── slices/      # Redux admin state slice (adminSlice.js)
│       └── thunks/      # Redux async thunks (adminThunks.js)
└── shared/              # Shared application infrastructure
    ├── api/             # Central Axios client and interceptors (apiClient.js)
    ├── components/      # Common UI primitives (TableSort, ToggleModeBtn, Spinner, ErrorPage)
    ├── layout/          # Shell elements (AppShell Header, Sidebar, NavbarLinksGroup)
    └── sdui/            # Server-Driven UI registry and layout renderer (Renderer.jsx)
```

---

## Development Commands

Run all commands from the repository root (`Frontend/`):

```bash
# Install dependencies
npm install

# Start Vite local development server (default: http://localhost:5173)
npm run dev

# Build for production (outputs bundled assets to dist/)
npm run build

# Run ESLint validation across JavaScript and JSX files
npm run lint

# Preview production build locally from dist/
npm run preview
```

*Note on Testing*: There is currently no `test` script defined in `package.json`. See [Testing & QA](#testing--qa) for setup blueprints.

---

## Code Conventions & Common Patterns

### File & Symbol Naming Patterns
- **React Components**: PascalCase with `.jsx` extension (e.g., `AdminDashBoard.jsx`, `CommonLayout.jsx`, `StatsGroup.jsx`).
- **Redux Slices**: camelCase ending with `Slice.js` (e.g., `adminSlice.js`, `authSlice.js`).
- **Redux Thunks**: camelCase ending with `Thunks.js` (e.g., `adminThunks.js`, `authThunks.js`).
- **Route Definitions**: `routes.jsx` placed at each feature root (e.g., `src/features/auth/routes.jsx`).
- **CSS Modules**: `<ComponentName>.module.css` (e.g., `AuthPage.module.css`, `NavbarLinksGroup.module.css`).

### Critical Case Sensitivity Invariants (Linux Compatibility)
When adding or importing files on Linux environments, adhere strictly to file case matches:
- **`Sidebar.Module.css` vs `Sidebar.module.css`**: The disk file is `Sidebar.Module.css`, but imported as `./Sidebar.module.css`. Keep cases identical when editing.
- **`ToggleModeBtn.Module.css` vs `ToggleModeBtn.module.css`**: The disk file is `ToggleModeBtn.Module.css`, imported as `./ToggleModeBtn.module.css`.
- **`SchedulingStatus.jsx`**: The component file is `SchedulingStatus.jsx` (uppercase `S`), but imported in `Renderer.jsx` with lowercase `s` (`./schedulingStatus`). Always normalize import casing to avoid Linux build breakages.

### Styling & Design System Coexistence
The project uses three complementary styling systems:
1. **Mantine UI v9 (`@mantine/core`)**: Primary UI component library (`AppShell`, `Paper`, `Grid`, `Table`, `Badge`, `Progress`, `Stack`, `Group`, `Breadcrumbs`, `Menu`). Dark mode is default (`<MantineProvider defaultColorScheme="dark">`).
2. **Tailwind CSS v4 (`@tailwindcss/vite`)**: Imported via `@import "tailwindcss";` in `src/index.css`. Used for utility layouts and alignment (e.g., `min-h-screen flex items-center justify-center`).
3. **CSS Modules**: Used for component-specific overrides using Mantine CSS variables and functions:
   ```css
   /* Example pattern from Sidebar: using Mantine light-dark helper */
   .sidebar {
     background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-8));
     border-right: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7));
   }
   ```

### State Management & Async Patterns
- Use **Redux Toolkit** (`createSlice` and `createAsyncThunk`).
- Reducers must use the `extraReducers` builder pattern to handle async states:
  ```javascript
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.components;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
  ```
- Components read state via `useSelector` and dispatch actions with `useDispatch`.

### Server-Driven UI (SDUI) Pattern
When extending the dashboard with new backend-driven widgets:
1. Create the presentation component under `src/features/admin/components/`.
2. Register the component key in `componentRegistry` inside `src/shared/sdui/Renderer.jsx`:
   ```javascript
   const componentRegistry = {
     stats: StatsGroup,
     'pie-chart': PieChart,
     'bar-chart': BarChart,
     'progress': ProgressCard,
     'scheduling-status': SchedulingStatus,
     'table': DataTable,
     // Add new mappings here
   };
   ```
3. Ensure the component accepts its data directly via the `data` prop passed by `DashboardRenderer`.

### Error Handling & Routing Guards
- Global 404/fallback routing is wired via `{ path: "*", element: <ErrorPage /> }`.
- `ErrorPage.jsx` provides fallback UI and backward navigation using `useNavigate()(-1)`.
- Component-level loading and error states must be explicitly guarded:
  ```javascript
  if (loading) return <Spinner />;
  if (error) return <div>Failed to load data.</div>;
  ```

---

## Important Files

| File Path | Purpose & Notes |
|---|---|
| `src/main.jsx` | Application bootstrap; wires `MantineProvider`, Redux `Provider`, and `RouterProvider`. |
| `src/App.jsx` | Root path component; automatically redirects `/` to `/login`. |
| `index.html` | Root HTML template mounting the React application. |
| `vite.config.js` | Vite 8 config loading `@vitejs/plugin-react` and `@tailwindcss/vite`. |
| `eslint.config.js` | ESLint flat configuration extending recommended JS, React Hooks, and React Refresh plugins. |
| `package.json` | Dependencies, scripts, and module definitions (`"type": "module"`). |
| `src/app/store.js` | Central Redux store aggregating `auth` and `admin` slice reducers. |
| `src/shared/api/apiClient.js` | Axios instance configured with `baseURL: "http://localhost:8000/api"` and auth interceptors. |
| `src/shared/sdui/Renderer.jsx` | SDUI layout engine and component registry mapping JSON schemas to React components. |
| `src/features/admin/routes.jsx` | Route definitions for `/admin` child routes. |
| `src/features/admin/CommonLayout.jsx` | Administrative layout shell mounting `Sidebar`, `Header`, and `<Outlet />`. |
| `src/features/admin/configs/configs.js` | Navigation definitions for the admin sidebar. |
| `src/features/admin/slices/adminSlice.js` | Admin state store (`dashboard`, `timetable`, `courses`, `faculty`, `students`, `rooms`). |
| `src/features/admin/thunks/adminThunks.js` | `fetchDashboard` thunk (currently resolves mock SDUI payload; API call commented out). |
| `src/shared/components/ProtectedRoute.jsx` | **Pending Stub**: 0 bytes placeholder for route authentication guard. |
| `src/features/auth/thunks/authThunks.js` | **Pending Stub**: 0 bytes placeholder for login/logout async thunks. |

---

## Runtime/Tooling Preferences

- **Runtime**: **Node.js** (v18+ or v20+ recommended).
- **Package Manager**: **`npm`**
  - Project uses `package-lock.json` (`lockfileVersion: 3`).
  - Do NOT use `yarn`, `pnpm`, or `bun` unless explicitly requested.
- **Module Format**: **ECMAScript Modules (ESM)**
  - `"type": "module"` configured in `package.json`.
  - Use standard `import` and `export` statements exclusively.
- **Path Aliases**: **None configured**.
  - `vite.config.js` defines no aliases (`resolve.alias` is omitted).
  - All file imports must use relative paths (e.g., `import { apiClient } from '../../shared/api/apiClient.js'`).
- **Environment Variables**:
  - Currently, no `.env` or `.env.example` exists.
  - The API URL is hardcoded in `apiClient.js`. When introducing dynamic endpoints, use the `VITE_` prefix (e.g., `import.meta.env.VITE_API_URL`).

---

## Testing & QA

### Current Status
- **Zero test files exist** in the repository (`0` unit, integration, or E2E tests).
- No testing dependencies or test scripts are installed in `package.json`.
- The repository is in greenfield status regarding test automation.

### Recommended Test Setup (Vitest + React Testing Library)
To introduce testing without disrupting the existing Vite 8 build pipeline:
1. **Dependencies**:
   ```bash
   npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```
2. **Vite / Vitest Configuration**: Add a `test` block to `vite.config.js`:
   ```javascript
   /// <reference types="vitest" />
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/setupTests.js',
       css: false,
     },
   })
   ```
3. **DOM & Mantine Environment Polyfills (`src/setupTests.js`)**:
   Mantine components and Recharts rely on browser APIs that must be mocked under `jsdom`:
   ```javascript
   import '@testing-library/jest-dom/vitest';

   // Polyfill window.matchMedia for MantineProvider
   Object.defineProperty(window, 'matchMedia', {
     writable: true,
     value: vi.fn().mockImplementation((query) => ({
       matches: false,
       media: query,
       onchange: null,
       addListener: vi.fn(),
       removeListener: vi.fn(),
       addEventListener: vi.fn(),
       removeEventListener: vi.fn(),
       dispatchEvent: vi.fn(),
     })),
   });

   // Polyfill ResizeObserver for Mantine components and Recharts
   global.ResizeObserver = class {
     observe() {}
     unobserve() {}
     disconnect() {}
   };
   ```
4. **Scripts to add to `package.json`**:
   ```json
   "scripts": {
     "test": "vitest",
     "test:run": "vitest run",
     "test:coverage": "vitest run --coverage"
   }
   ```

### Priority Coverage Targets for AI Agents & Developers
1. **SDUI Renderer (`src/shared/sdui/Renderer.jsx`)**:
   - Assert all component types (`stats`, `pie-chart`, `bar-chart`, `progress`, `scheduling-status`, `table`) render accurately with mock payloads.
   - Assert recursive `row` rendering and column span allocation.
   - Assert graceful warning/fallback when unknown component types are received.
2. **Redux Slices & Async Thunks**:
   - `adminSlice.js`: Test `fetchDashboard.pending`, `fulfilled`, and `rejected` transitions.
   - `authSlice.js`: Test user state initialization and token management once implemented.
3. **Shared Components**:
   - `src/shared/components/TableSort.jsx`: Verify column sorting, filtering, and custom cell formatters (`progress`, `badge`).
   - `src/shared/components/ToggleModeBtn.jsx`: Verify color scheme switching between light and dark modes.
4. **API Client (`src/shared/api/apiClient.js`)**:
   - Verify `Authorization` header injection when `token` is present in `localStorage`.
