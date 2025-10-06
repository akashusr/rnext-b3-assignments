import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name is too long"),
    email: z.email("Invalid email address").max(50, "Email is too long"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password is too long"),
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(
    //   /[^a-zA-Z0-9]/,
    //   "Password must contain at least one special character"
    // ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password is too long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(150, "Bio cannot exceed 150 characters"),
  website: z.string().url("Invalid URL format").optional(),
  gender: z.string().optional(),
});

export const postSchema = z.object({
  image: z
    .file("Image is required")
    .mime(["image/webp", "image/png", "image/jpeg", ""]),
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(2200, "Max length 2200 characters long"),
});

export const commentSchema = z.object({
  text: z.string().min(1, "Comment is required"),
});
