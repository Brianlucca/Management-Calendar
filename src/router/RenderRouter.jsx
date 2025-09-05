import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrivateLayout from "./PrivateLayout";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Calendar from "../pages/calendar/Calendar";
import Reminder from "../pages/reminder/Reminder";
import Pomodoro from "../pages/pomodoro/Pomodoro";
import TagsPage from "../pages/tagsPage/TagsPage";
import Profile from "../pages/profile/Profile";
import LandingPage from "../pages/public/LandingPage";
import NotFoundPage from "../pages/notFoundPage/NotFoundPage";

function RenderRouter() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      
      <Route
        path="/"
        element={
          currentUser ? (
            <PrivateRoute>
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            </PrivateRoute>
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Calendar />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/pomodoro"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Pomodoro />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
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
        path="/profile"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <Profile />
            </PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default RenderRouter;