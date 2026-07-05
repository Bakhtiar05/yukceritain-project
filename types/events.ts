export type EventType = 'ONLINE' | 'OFFLINE';
export type PricingType = 'FREE' | 'PAID';
export type EventStatus = 'Draft' | 'Published' | 'Closed' | 'Completed';
export type PaymentStatus = 'FREE' | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'WAITLIST';

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  cover_image: string | null;
  event_type: EventType;
  pricing_type: PricingType;
  price: number;
  currency: string;
  speaker: string | null;
  organizer: string;
  venue_name: string | null;
  venue_address: string | null;
  google_maps_url: string | null;
  meeting_platform: string | null;
  meeting_link: string | null;
  start_datetime: string;
  end_datetime: string;
  registration_deadline: string;
  quota: number;
  registered_count: number;
  waiting_list_enabled: boolean;
  status: EventStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  registration_code: string;
  full_name: string;
  email: string;
  phone: string;
  institution: string | null;
  city: string | null;
  gender: string | null;
  payment_status: PaymentStatus;
  registration_status: RegistrationStatus;
  qr_code: string | null;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
  events?: Event; // Joined relation
}

export interface EventPayment {
  id: string;
  registration_id: string;
  xendit_invoice_id: string;
  external_id: string;
  payment_method: string | null;
  amount: number;
  payment_status: string;
  invoice_url: string | null;
  paid_at: string | null;
  expired_at: string;
  created_at: string;
  updated_at: string;
}
