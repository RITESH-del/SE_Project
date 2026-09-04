import { lazy } from "react";

const AuthPage = lazy(() => import("./pages/AuthPage.jsx"));

const routes = [
    {
        path: "/auth",
        element: <AuthPage />,
    },
];

export default routes;