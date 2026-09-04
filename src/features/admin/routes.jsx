import { lazy } from 'react'

const CommonLayout = lazy(() => import('./CommonLayout'))
const AdminDashboard = lazy(() => import('./pages/AdminDashBoard'))

const AdminRoutes = [
    {
        path: '/admin',
        element: <CommonLayout />,
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
        ],
    },
]

export default AdminRoutes