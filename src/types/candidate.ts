import { z } from "zod"

export const candidateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  cvAttachment: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  recruiter: z.string().min(1, "Recruiter is required"),
  note: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]),
  yearsOfExperience: z.number().min(0).optional(),
  highestLevel: z.enum(["junior", "mid", "senior", "lead"]),
})

export type CandidateFormData = z.infer<typeof candidateSchema>

