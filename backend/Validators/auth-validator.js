import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is Invalid" })
    .trim()
    .min(10, { message: "Email must be at least 10 characters long" })
    .max(255, { message: "Email must be at most 255 characters long" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(80, { message: "Password must be at most 80 characters long" }),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is Invalid" })
    .trim()
    .min(10, { message: "Email must be at least 10 characters long" })
    .max(255, { message: "Email must be at most 255 characters long" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(80, { message: "Password must be at most 80 characters long" }),
});

export default { registerSchema, loginSchema };
