import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const signupSchema = z.object({
  userName: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "User Name can only contain letters, numbers, and underscores",
    }),
  email: z.string().email(),
  fullName: z.string().min(3).max(30),
  password: z
    .string()
    .regex(
      strongPasswordRegex,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    ),
});