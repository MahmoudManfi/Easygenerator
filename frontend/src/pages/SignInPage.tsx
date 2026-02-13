import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/useAuth";
import { authApi } from "../api/authApi";
import { extractErrorMessage } from "../utils/error.util";
import { signInSchema, type SignInFormData } from "../schemas/auth.schemas";
import FormInput from "../components/FormInput";
import { Routes } from "../constants/routes";
import { useRedirectIfAuthenticated } from "../hooks/useRedirectIfAuthenticated";
import "./Auth.css";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string>("");
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: SignInFormData) => {
    setSubmitError("");
    try {
      const { user: userData } = await authApi.signIn(data);
      login(userData); // Cookie is already set by backend
      void navigate(Routes.ROOT);
    } catch (error) {
      const message = extractErrorMessage(error, "Invalid credentials");
      setSubmitError(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
        >
          <FormInput
            id="email"
            type="email"
            label="Email"
            register={register("email")}
            error={errors.email}
            placeholder="Enter your email"
          />

          <FormInput
            id="password"
            type="password"
            label="Password"
            register={register("password")}
            error={errors.password}
            placeholder="Enter your password"
          />

          {submitError && (
            <div className="error-message submit-error">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don&apos;t have an account? <Link to={Routes.SIGNUP}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
