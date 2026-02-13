import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/useAuth";
import { authApi } from "../api/authApi";
import { extractErrorMessage } from "../utils/error.util";
import { signUpSchema, type SignUpFormData } from "../schemas/auth.schemas";
import FormInput from "../components/FormInput";
import { Routes } from "../constants/routes";
import { useRedirectIfAuthenticated } from "../hooks/useRedirectIfAuthenticated";
import "./Auth.css";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string>("");
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: SignUpFormData) => {
    setSubmitError("");
    try {
      // Only send email, name, and password to backend (exclude confirmPassword)
      const { confirmPassword, ...signUpData } = data;
      const { user: userData } = await authApi.signUp(signUpData);
      login(userData); // Cookie is already set by backend
      void navigate(Routes.ROOT);
    } catch (error) {
      const message = extractErrorMessage(error, "Sign up failed");
      setSubmitError(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
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
            id="name"
            type="text"
            label="Name"
            register={register("name")}
            error={errors.name}
            placeholder="Enter your name (min 3 characters)"
          />

          <FormInput
            id="password"
            type="password"
            label="Password"
            register={register("password")}
            error={errors.password}
            placeholder="Enter your password"
            hint="Password must be at least 8 characters with one letter, one number, and one special character"
          />

          <FormInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            register={register("confirmPassword")}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
          />

          {submitError && (
            <div className="error-message submit-error">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to={Routes.SIGNIN}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
