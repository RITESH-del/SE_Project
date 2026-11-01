# Contributing to the Frontend

Thank you for contributing! This guide outlines the development workflow, architecture patterns, coding standards, and pull request checklist for working on the Academic Campus & Timetable Management Frontend.

---

## 1. Prerequisites & Environment

Before you begin, ensure you have:
- **Node.js**: `v18.0.0` or higher (`v20+` LTS recommended).
- **Package Manager**: **`npm`** (v9+ / v10+).
  - Do **not** use `yarn`, `pnpm`, or `bun`. The repository enforces standard npm via `package-lock.json` (`lockfileVersion: 3`).
- **Backend Service (Optional for UI prototyping)**:
  - The API client connects to `http://localhost:8000/api` by default (`src/shared/api/apiClient.js`).
  - During early development, admin dashboard data is mocked in `src/features/admin/thunks/adminThunks.js`.

---

## 2. Quickstart & Development Workflow

```bash
# 1. Clone the repository and navigate to Frontend
cd Frontend

# 2. Install dependencies cleanly
npm install

# 3. Start local development server with Hot Module Replacement (HMR)
npm run dev
# Vite runs at http://localhost:5173 (redirects / -> /login)

# 4. Check code for linting errors
npm run lint

# 5. Build for production
npm run build

# 6. Preview the production build locally
npm run preview
```

---

## 3. Architecture & Where Code Lives

The frontend follows a **Feature-Sliced / Layered Architecture**:

```
src/
├── app/                  # Application bootstrap and Redux root store (store.js)
├── features/             # Business domains (isolated vertical slices)
│   ├── auth/             # Login, auth state, auth routes
│   └── admin/            # Admin portal (dashboard, timetables, campus config)
│       ├── components/   # Admin widgets (charts, metrics, scheduling tables)
│       ├── configs/      # Navigation metadata (sidebar menus)
│       ├── pages/        # Route page views (AdminDashBoard.jsx)
│       ├── slices/       # Redux slices (adminSlice.js)
│       └── thunks/       # Async API calls / mock payloads (adminThunks.js)
└── shared/               # Shared libraries across features
    ├── api/              # Axios instance and request interceptors (apiClient.js)
    ├── components/       # Shared UI components (TableSort, ToggleModeBtn, Spinner, ErrorPage)
    ├── layout/           # AppShell layout (Header with breadcrumbs, Sidebar)
    └── sdui/             # Server-Driven UI component registry and grid renderer (Renderer.jsx)
```

---

## 4. Common Contribution Tasks

### A. Adding a New Route
1. Define your page component inside `src/features/<feature>/pages/` using `export default`.
2. Open `src/features/<feature>/routes.jsx`.
3. Wrap your page in `React.lazy()` for code-splitting:
   ```javascript
   import { lazy } from 'react';
   const MyNewPage = lazy(() => import('./pages/MyNewPage'));

   const routes = [
     // ...
     {
       path: 'my-new-path',
       element: <MyNewPage />,
     },
   ];
   export default routes;
   ```
4. If it belongs to `/admin`, nest it under `children` in `src/features/admin/routes.jsx` so it renders inside `CommonLayout`.

### B. Adding a New Redux Slice or Thunk
1. Slices live in `src/features/<feature>/slices/<name>Slice.js`.
2. Async API actions live in `src/features/<feature>/thunks/<name>Thunks.js` using `createAsyncThunk`.
3. Register your new reducer in `src/app/store.js`:
   ```javascript
   import { configureStore } from "@reduxjs/toolkit";
   import authReducer from "../features/auth/slices/authSlice.js";
   import adminReducer from "../features/admin/slices/adminSlice.js";
   import myNewReducer from "../features/<feature>/slices/myNewSlice.js";

   export const store = configureStore({
     reducer: {
       auth: authReducer,
       admin: adminReducer,
       myNew: myNewReducer,
     },
   });
   ```

### C. Adding a Widget to Server-Driven UI (SDUI)
The admin dashboard renders server-driven component payloads via `src/shared/sdui/Renderer.jsx`.
To add a new widget type:
1. Build your presentation component in `src/features/admin/components/` (accepting a `data` prop).
2. Register the component key in `componentRegistry` in `src/shared/sdui/Renderer.jsx`:
   ```javascript
   import NewWidget from '../../features/admin/components/NewWidget';

   const componentRegistry = {
     stats: StatsGroup,
     'pie-chart': PieChart,
     'bar-chart': BarChart,
     'progress': ProgressCard,
     'scheduling-status': SchedulingStatus,
     'table': DataTable,
     'new-widget': NewWidget, // Register your component here
   };
   ```

---

## 5. Coding Standards & Conventions

### File & Symbol Naming
- **Components**: PascalCase with `.jsx` (`AdminDashBoard.jsx`, `ProgressCard.jsx`).
- **Slices**: camelCase ending in `Slice.js` (`adminSlice.js`).
- **Thunks**: camelCase ending in `Thunks.js` (`adminThunks.js`).
- **CSS Modules**: `<ComponentName>.module.css` (e.g. `NavbarLinksGroup.module.css`).

### Critical Linux Case-Sensitivity Invariant
Git and Linux file systems are strictly case-sensitive. Always ensure:
- CSS module imports match the exact file name on disk (`.module.css` vs `.Module.css`).
- Component imports match file casing (e.g., import `SchedulingStatus` from `./SchedulingStatus.jsx`, not `./schedulingStatus`).
- Inconsistent casing causes silent local passes on macOS/Windows but breaks Linux CI/CD and deployment builds.

### Import Paths (No Aliases)
Vite is not configured with path aliases (e.g., `@/` is not supported).
- Always use standard relative paths:
  ```javascript
  // Good
  import { apiClient } from '../../shared/api/apiClient.js';

  // Bad - will fail Vite build
  import { apiClient } from '@/shared/api/apiClient';
  ```

### Styling Guidelines
- **Mantine UI v9**: Use `@mantine/core` for layout (`AppShell`, `Grid`, `Paper`, `Stack`, `Group`) and interactive elements (`Button`, `Table`, `Badge`, `Progress`, `Menu`). The application defaults to dark mode.
- **Tailwind CSS v4**: Use utility classes for flexbox/grid alignments, spacing, and quick responsive sizing (`min-h-screen`, `flex`, `py-20`).
- **CSS Modules**: Use for fine-grained style rules and Mantine token integration. Use Mantine's `light-dark(lightColor, darkColor)` helper for theme compatibility:
  ```css
  .container {
    background-color: light-dark(var(--mantine-color-white), var(--mantine-color-dark-8));
    border: 1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7));
  }
  ```

### API Calls & Authentication
- Always make network requests via `src/shared/api/apiClient.js`.
- Do not instantiate secondary Axios instances or manually attach Bearer headers; the request interceptor attaches `Authorization: Bearer <token>` from `localStorage` automatically.

---

## 6. Pull Request (PR) Checklist

Before opening a pull request, run through this checklist:

- [ ] `npm run lint` passes cleanly with zero errors.
- [ ] `npm run build` succeeds without bundle or syntax errors.
- [ ] All new files and imports have consistent case sensitivity (verified on Linux).
- [ ] No hardcoded absolute paths or unconfigured `@/` path aliases.
- [ ] All new routes use `React.lazy()` for code-splitting.
- [ ] No `console.log` debugging statements or sensitive tokens committed.
- [ ] Components handle loading and error states gracefully.
- [ ] PR description clearly explains the changes and references any relevant issues.
