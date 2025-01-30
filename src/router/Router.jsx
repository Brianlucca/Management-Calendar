import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import PrivateRoute from "./PrivateRoute";

function RenderRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default RenderRouter;