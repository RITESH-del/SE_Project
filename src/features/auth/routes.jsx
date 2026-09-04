import { lazy } from "react";

const AuthPage = lazy(() => import("./pages/AuthPage.jsx"));

const routes = [
    {
        path: "/login",
        element: <AuthPage />,
    },
];

export default routes;