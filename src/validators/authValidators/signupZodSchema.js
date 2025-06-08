import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

export const signupSchema = z.object({
  userName: z.string().min(3).max(30),
  email: z.string().email(),
  fullName: z.string().min(3).max(30),
  role: z.enum(["developer", "employer", "both"]),
  password: z
    .string()
    .regex(
      strongPasswordRegex,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    ),
});