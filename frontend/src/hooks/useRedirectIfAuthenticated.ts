import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Routes } from "../constants/routes";

/**
 * Custom hook that redirects authenticated users to the root page
 * Useful for public pages like sign-in and sign-up that should not be
 * accessible when the user is already logged in
 */
export const useRedirectIfAuthenticated = (): void => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate(Routes.ROOT, { replace: true });
    }
  }, [user, isLoading, navigate]);
};

