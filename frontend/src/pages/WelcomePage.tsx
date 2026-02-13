import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Routes } from "../constants/routes";
import "./WelcomePage.css";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    void navigate(Routes.SIGNIN);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome to the application.</h1>
        <p>You have successfully signed in!</p>
        <button
          onClick={() => {
            void handleLogout();
          }}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
