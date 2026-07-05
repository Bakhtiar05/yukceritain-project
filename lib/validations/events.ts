import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(100).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description is required"),
  short_description: z.string().min(10, "Short description is required").max(200),
  cover_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  event_type: z.enum(["ONLINE", "OFFLINE"]),
  pricing_type: z.enum(["FREE", "PAID"]),
  price: z.coerce.number().min(0).default(0),
  currency: z.string().default("IDR"),
  speaker: z.string().optional(),
  organizer: z.string().min(1, "Organizer is required").default("YukceritaIN"),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  google_maps_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  meeting_platform: z.string().optional(),
  meeting_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  start_datetime: z.string().min(1, "Start date and time is required"),
  end_datetime: z.string().min(1, "End date and time is required"),
  registration_deadline: z.string().min(1, "Registration deadline is required"),
  quota: z.coerce.number().min(0).default(0),
  waiting_list_enabled: z.boolean().default(false),
  status: z.enum(["Draft", "Published", "Closed", "Completed"]).default("Draft"),
  is_featured: z.boolean().default(false),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const registrationSchema = z.object({
  event_id: z.string().uuid(),
  full_name: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  institution: z.string().optional(),
  city: z.string().optional(),
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
