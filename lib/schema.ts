import { z } from "zod";

export const incidentSchema = z.object({
  concernTypes: z.array(z.string()).min(1, "Please select at least one concern type"),
  otherConcernType: z.string().optional(),
  date: z.string().min(1, "Please select a date"),
  locations: z.array(z.string()).min(1, "Please select at least one location"),
  otherLocation: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  honeypot: z.string().max(0, "Bot detected"),
});

export type IncidentFormData = z.infer<typeof incidentSchema>;
