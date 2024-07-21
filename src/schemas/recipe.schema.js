import { z } from "zod";

export const RecipesSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }).min(1, "Name must be at least 1 character").max(255).trim(),
  ingredients: z.array(z.string({
    required_error: "At least one ingredient is required",
  })).min(1, "At least one ingredient is required"),
  instructions: z.string({
    required_error: "Instructions are required",
  }).min(1, "Instructions are required"),
  preparationTime: z.number({
    required_error: "Preparation time is required",
  }).min(0, "Preparation time must be at least 0"),
  calories: z.number({
    required_error: "Calories are required",
  }).min(0, "Calories must be at least 0"),
  userId: z.string({
    required_error: "User ID is required",
  }),
});
