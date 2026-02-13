import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import WelcomePage from "./pages/WelcomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes } from "./constants/routes";
import "./App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <RouterRoutes>
            <Route path={Routes.SIGNUP} element={<SignUpPage />} />
            <Route path={Routes.SIGNIN} element={<SignInPage />} />
            <Route
              path={Routes.ROOT}
              element={
                <ProtectedRoute>
                  <WelcomePage />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<NotFoundPage />} />
          </RouterRoutes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
