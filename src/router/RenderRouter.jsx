import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import SignIn from "../pages/auth/SignIn";
import PrivateRoute from "./privateRoute/PrivateRoute";
import PrivateLayout from "./privateLayout/PrivateLayout";
import Admin from "../pages/admin/Admin";
import AdminRoute from "./adminRoute/AdminRoute";
import TagsPage from "../pages/tagsPage/TagsPage";

function RenderRouter() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/tags"
        element={
          <PrivateLayout>
            <TagsPage />
          </PrivateLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <PrivateLayout>
              <Admin />
            </PrivateLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Dashboard />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default RenderRouter;
