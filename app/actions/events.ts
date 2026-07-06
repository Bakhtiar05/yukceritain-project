"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { EventFormValues, RegistrationFormValues } from "@/lib/validations/events";
import { createXenditInvoice } from "@/lib/services/xendit";
import { Event, EventRegistration, EventPayment } from "@/types/events";

// --- Admin Actions ---


export async function createEvent(data: EventFormValues) {
  const supabase = await createClient();
  
  const { data: newEvent, error } = await supabase
    .from("events")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    return { error: error.message };
  }

  return { data: newEvent };
}

export async function updateEvent(id: string, data: Partial<EventFormValues>) {
  const supabase = await createClient();
  
  const { data: updatedEvent, error } = await supabase
    .from("events")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    return { error: error.message };
  }

  return { data: updatedEvent };
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting event:", error);
    return { error: error.message };
  }

  return { success: true };
}

// --- Public Actions ---

export async function getPublicEvents(): Promise<Event[]> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .in("status", ["Published", "Completed"])
    .order("start_datetime", { ascending: true });

  if (error) {
    console.error("Error fetching public events:", error);
    return [];
  }
  return data as Event[];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching event by slug:", error);
    return null;
  }
  return data as Event;
}

export async function registerForEvent(data: RegistrationFormValues) {
  const supabase = await createAdminClient();

  // 1. Get the event details
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", data.event_id)
    .single();

  if (eventError || !event) {
    return { error: "Event not found." };
  }

  if (event.status !== "Published") {
    return { error: "Registration is closed for this event." };
  }

  if (event.quota > 0 && event.registered_count >= event.quota) {
    return { error: "Event quota is full." };
  }

  // 2. Generate unique registration code
  const timestamp = Date.now().toString().slice(-4);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const registrationCode = `YCI-EVT-${timestamp}-${randomStr}`;
  
  const isFree = event.pricing_type === "FREE";
  
  // 3. Create Registration
  const { data: registration, error: regError } = await supabase
    .from("event_registrations")
    .insert([{
      event_id: data.event_id,
      registration_code: registrationCode,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      institution: data.institution,
      city: data.city,
      gender: data.gender,
      payment_status: isFree ? "FREE" : "PENDING",
      registration_status: "CONFIRMED",
      qr_code: isFree ? `QR-${registrationCode}` : null,
    }])
    .select()
    .single();

  if (regError) {
    console.error("Error creating registration:", regError);
    return { error: "Failed to create registration." };
  }

  // 4. Update Event Registered Count (Optimistic, could use RPC)
  await supabase
    .from("events")
    .update({ registered_count: event.registered_count + 1 })
    .eq("id", event.id);

  // 5. If FREE, return success immediately
  if (isFree) {
    return { success: true, registrationCode };
  }

  // 6. If PAID, integrate with Xendit
  try {
    const external_id = `evt_${registration.id}_${Date.now()}`;
    
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
      if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
      return 'http://localhost:3000';
    };
    
    const baseUrl = getBaseUrl();

    const invoice = await createXenditInvoice({
      external_id,
      amount: event.price,
      description: `Ticket for ${event.title}`,
      customer: {
        given_names: data.full_name,
        email: data.email,
        mobile_number: data.phone,
      },
      success_redirect_url: `${baseUrl}/events/ticket/${registrationCode}`,
      failure_redirect_url: `${baseUrl}/events/${event.slug}`,
      currency: event.currency,
    });

    // 7. Store Payment Record
    const { error: paymentError } = await supabase
      .from("event_payments")
      .insert([{
        registration_id: registration.id,
        xendit_invoice_id: invoice.id,
        external_id,
        amount: event.price,
        invoice_url: invoice.invoice_url,
        payment_status: invoice.status,
        expired_at: invoice.expiry_date,
      }]);

    if (paymentError) {
      console.error("Error storing payment record:", paymentError);
      return { error: "Failed to initiate payment." };
    }

    return { success: true, redirectUrl: invoice.invoice_url, registrationCode };
  } catch (error: any) {
    console.error("Payment integration error:", error);
    return { error: "Payment integration failed: " + error.message };
  }
}

export async function getRegistrationByCode(code: string): Promise<EventRegistration | null> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("event_registrations")
    .select("*, events(*)")
    .eq("registration_code", code)
    .single();

  if (error) {
    console.error("Error fetching registration:", error);
    return null;
  }
  return data;
}

export async function checkInParticipant(code: string) {
  const supabase = await createClient();
  
  const { data: registration, error: fetchError } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("registration_code", code)
    .single();

  if (fetchError || !registration) {
    return { error: "Registration not found" };
  }

  if (registration.checked_in_at) {
    return { error: "Already checked in", data: registration };
  }

  if (registration.payment_status === "PENDING") {
    return { error: "Payment is pending" };
  }

  const { data: updated, error: updateError } = await supabase
    .from("event_registrations")
    .update({ checked_in_at: new Date().toISOString() })
    .eq("id", registration.id)
    .select()
    .single();

  if (updateError) {
    return { error: "Failed to check in" };
  }

  return { success: true, data: updated };
}
