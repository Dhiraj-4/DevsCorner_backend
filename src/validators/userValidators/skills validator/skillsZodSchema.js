// validations/skillValidation.js
import { z } from "zod";

export const skillsSchema = z.object({
  skill: z
    .string()
    .trim()
    .min(1, "Skill is required")
    .max(50, "Skill too long (max 50 chars)"),
});

export const deleteSkillSchema = z.object({
  skill: z.string().trim().min(1, "Skill is required"),
});