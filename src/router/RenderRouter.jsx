import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import SignIn from "../pages/auth/signIn/SignIn";
import PrivateRoute from "./privateRoute/PrivateRoute";
import PrivateLayout from "./privateLayout/PrivateLayout";
import TagsPage from "../pages/tagsPage/TagsPage";
import Profile from "../pages/profile/Profile";
import SignUp from "../pages/auth/signUp/SignUp";
import VerifyEmail from "../pages/auth/verifyEmail/VerifyEmail";
import NotFoundPage from "../pages/notFoundPage/NotFoundPage";
import Reminder from "../pages/reminder/Reminder";

function RenderRouter() {

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/*" element={<NotFoundPage />} />
      <Route
        path="/reminder"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Reminder />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tags"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <TagsPage />
            </PrivateLayout>
          </PrivateRoute>
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
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Profile />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default RenderRouter;
