import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Suspense } from 'react'
import Spinner from './shared/components/Spinner'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'

/* Routes */
import AuthRoutes from './features/auth/routes.jsx'
import AdminRoutes from './features/admin/routes.jsx'

import App from './App.jsx'
import ErrorPage from './shared/components/ErrorPage.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
    ...AuthRoutes,
    ...AdminRoutes
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MantineProvider defaultColorScheme="dark">
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </MantineProvider>
  </Provider>,
)
