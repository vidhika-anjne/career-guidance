import React from "react";
import { createBrowserRouter, RouterProvider, Routes } from "react-router-dom";
import PathConstants from "./routes/PathConstants";
import Layout from "./layout/Layout";
import routes, { userRoutes, adminRoutes } from "./routes/index.jsx";
import Page404 from "./pages/Page404";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: routes,
        errorElement: <Page404 />,
      },
      {
        path: PathConstants.HOME,
        element: <UserLayout />,
        children: userRoutes,
        errorElement: <Page404 />,
      },
      {
        path: PathConstants.ADMIN,
        element: <AdminLayout />,
        children: adminRoutes,
        errorElement: <Page404 />,
      },
    ],
    {
      future: {
        v7_skipActionErrorRevalidation: true,
      },
    }
  );

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer />
    </>
  );
}

export default App;
