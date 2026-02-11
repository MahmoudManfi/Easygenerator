import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Welcome.css";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    void navigate("/signin");
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome to the application.</h1>
        <p>You have successfully signed in!</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;
