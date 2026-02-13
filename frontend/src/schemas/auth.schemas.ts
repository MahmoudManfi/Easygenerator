import { z } from "zod";

/**
 * Sign-in form validation schema
 * Matches backend SignInDto validation
 */
export const signInSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Sign-up form validation schema
 * Matches backend SignUpDto validation
 * Includes confirmPassword field for frontend validation only
 */
export const signUpSchema = z
  .object({
    email: z.email("Please provide a valid email address"),
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters long")
      .trim(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[@$!%*#?&]/,
        "Password must contain at least one special character (@$!%*#?&)",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This error will be attached to confirmPassword field
  });

/**
 * Type inference from schemas
 */
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
