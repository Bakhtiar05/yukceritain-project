"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPaymentAndBookingDetails(requestNumber: string) {
  try {
    const supabase = await createClient();

    const { data: booking, error: bookingError } = await supabase
      .from("consultation_requests")
      .select("*, payments(*)")
      .eq("request_number", requestNumber)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: "Data permohonan tidak ditemukan." };
    }

    const payment = booking.payments?.[0]; // Get the first related payment if exists

    return {
      success: true,
      data: {
        requestNumber: booking.request_number,
        date: booking.tanggal_konsultasi,
        time: booking.waktu_konsultasi,
        method: booking.metode_konsultasi,
        bookingStatus: booking.db_status,
        paymentStatus: payment?.payment_status || "PENDING",
        invoiceUrl: payment?.invoice_url || null,
        paymentMethod: payment?.payment_method || null,
        amount: payment?.amount || null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch payment details:", error);
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
