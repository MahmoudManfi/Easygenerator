import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Routes } from "../constants/routes";
import "./NotFoundPage.css";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    if (user) {
      navigate(Routes.ROOT);
    } else {
      navigate(Routes.SIGNIN);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate(Routes.SIGNIN);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for does not exist.
        </p>
        <div className="not-found-actions">
          <button onClick={handleGoHome} className="not-found-button">
            {user ? "Go to Home" : "Go to Sign In"}
          </button>
          {user && (
            <button onClick={handleSignOut} className="not-found-link">
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

