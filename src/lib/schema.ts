import * as z from "zod"

export const userSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dob: z.date().optional(),
  phoneNumber: z.string().optional(),
  role: z.string().min(1, "Please select a role"),
  status: z.enum(["active", "inactive"]).default("active"),
  address: z.string().optional(),
  gender: z.enum(["male", "female",""]).optional(),
  department: z.string().min(1, "Please select a department"),
  note: z.string().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>

