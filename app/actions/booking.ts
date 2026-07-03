"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { bookingSchema, BookingFormData } from "@/lib/schemas/booking";
import { format } from "date-fns";
import { createXenditInvoice } from "@/lib/services/xendit";

async function assignCounselor(dateStr: string, timeStr: string, supabase: any): Promise<string | null> {
  // Priority: Active, Public, lowest current booking count (for that date), lowest display_order
  
  // 1. Fetch all active and public counselors
  const { data: counselors, error: counselorError } = await supabase
    .from("counselors")
    .select("id, display_order")
    .eq("is_active", true)
    .eq("is_public", true)
    .order("display_order", { ascending: true });
    
  if (counselorError || !counselors || counselors.length === 0) return null;
  
  // 2. Fetch all bookings for the specified date and time to check availability and count
  const { data: bookings, error: bookingError } = await supabase
    .from("consultation_requests")
    .select("counselor_id")
    .eq("tanggal_konsultasi", dateStr)
    .eq("waktu_konsultasi", timeStr)
    .in("db_status", ["Menunggu Verifikasi", "Disetujui", "Waiting Payment", "Waiting Admin Confirmation", "Processing"]);
    
  const bookedCounselorIds = new Set(bookings?.map((b: any) => b.counselor_id).filter(Boolean));
  
  // Filter out counselors who are already booked at this exact time
  const availableCounselors = counselors.filter((c: any) => !bookedCounselorIds.has(c.id));
  
  if (availableCounselors.length === 0) return null;
  
  // 3. For the remaining available counselors, count their total active bookings for the *entire day*
  const { data: dayBookings } = await supabase
    .from("consultation_requests")
    .select("counselor_id")
    .eq("tanggal_konsultasi", dateStr)
    .in("db_status", ["Menunggu Verifikasi", "Disetujui", "Waiting Payment", "Waiting Admin Confirmation", "Processing"]);
    
  const bookingCounts: Record<string, number> = {};
  dayBookings?.forEach((b: any) => {
    if (b.counselor_id) {
      bookingCounts[b.counselor_id] = (bookingCounts[b.counselor_id] || 0) + 1;
    }
  });
  
  // 4. Sort by lowest booking count, then lowest display order
  availableCounselors.sort((a: any, b: any) => {
    const countA = bookingCounts[a.id] || 0;
    const countB = bookingCounts[b.id] || 0;
    if (countA !== countB) return countA - countB;
    return a.display_order - b.display_order;
  });
  
  return availableCounselors[0].id;
}

export async function submitBooking(data: BookingFormData) {
  try {
    console.log("[submitBooking] Server action called");

    // FIX: Next.js Server Actions serialize Date objects as ISO strings when
    // transferring from client to server. Mobile browsers are particularly
    // affected because they may serialize dates differently. We must coerce
    // string dates back to Date objects before Zod validation with z.date().
    const coercedData = {
      ...data,
      tanggal_lahir: data.tanggal_lahir instanceof Date
        ? data.tanggal_lahir
        : new Date(data.tanggal_lahir),
      tanggal_konsultasi: data.tanggal_konsultasi instanceof Date
        ? data.tanggal_konsultasi
        : new Date(data.tanggal_konsultasi),
    };

    // Validate that date coercion produced valid dates
    if (isNaN(coercedData.tanggal_lahir.getTime())) {
      console.error("[submitBooking] Invalid tanggal_lahir after coercion:", data.tanggal_lahir);
      return { success: false, error: "Tanggal lahir tidak valid. Silakan isi ulang." };
    }
    if (isNaN(coercedData.tanggal_konsultasi.getTime())) {
      console.error("[submitBooking] Invalid tanggal_konsultasi after coercion:", data.tanggal_konsultasi);
      return { success: false, error: "Tanggal konsultasi tidak valid. Silakan isi ulang." };
    }

    console.log("[submitBooking] Date coercion complete:", {
      tanggal_lahir: coercedData.tanggal_lahir.toISOString(),
      tanggal_konsultasi: coercedData.tanggal_konsultasi.toISOString(),
    });

    // Validate again on the server (now with proper Date objects)
    const parsedData = bookingSchema.parse(coercedData);
    console.log("[submitBooking] Zod validation passed");
    
    // Use admin client (service role key) to bypass RLS — the consultation_requests
    // table has RLS enabled but no INSERT policy for anonymous/public users.
    const supabase = createAdminClient();

    const formattedTanggalKonsultasi = format(parsedData.tanggal_konsultasi, "yyyy-MM-dd");

    // Auto-assign counselor if preference is auto
    let finalCounselorId = parsedData.counselor_id;
    if (parsedData.counselor_preference === "auto") {
      console.log("[submitBooking] Auto-assigning counselor...");
      const assignedId = await assignCounselor(formattedTanggalKonsultasi, parsedData.waktu_konsultasi, supabase);
      if (assignedId) {
        finalCounselorId = assignedId;
        console.log("[submitBooking] Assigned counselor:", assignedId);
      } else {
        console.warn("[submitBooking] Failed to auto-assign counselor, no availability.");
        // We could throw an error, but let's allow it to proceed with NULL counselor so admin can assign later
      }
    }

    // Generate request number ATM-YYYYMMDD-XXXX
    const todayStr = format(new Date(), "yyyyMMdd");
    
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
    const requestNumber = `ATM-${todayStr}-${randomString}`;

    console.log("[submitBooking] Inserting to Supabase with request_number:", requestNumber);

    const { error: insertError, data: requestData } = await supabase
      .from("consultation_requests")
      .insert({
        request_number: requestNumber,
        counselor_id: finalCounselorId || null,
        
        email: parsedData.email,
        nama_lengkap: parsedData.nama_lengkap,
        nama_panggilan: parsedData.nama_panggilan,
        tanggal_lahir: format(parsedData.tanggal_lahir, "yyyy-MM-dd"),
        jenis_kelamin: parsedData.jenis_kelamin,
        nik: parsedData.nik,
        nomor_hp: parsedData.nomor_hp,
        alamat_lengkap: parsedData.alamat_lengkap,
        provinsi: parsedData.provinsi,
        
        status: parsedData.status,
        status_lainnya: parsedData.status_lainnya,
        alasan: parsedData.alasan,
        alasan_lainnya: parsedData.alasan_lainnya,
        topik_permasalahan: parsedData.topik_permasalahan,
        topik_lainnya: parsedData.topik_lainnya,
        ceritakan_permasalahan: parsedData.ceritakan_permasalahan,
        
        tanggal_konsultasi: format(parsedData.tanggal_konsultasi, "yyyy-MM-dd"),
        waktu_konsultasi: parsedData.waktu_konsultasi,
        metode_konsultasi: parsedData.metode_konsultasi,
        
        urutan_konseling: parsedData.urutan_konseling,
        sumber_informasi: parsedData.sumber_informasi,
        sumber_informasi_lainnya: parsedData.sumber_informasi_lainnya,
        db_status: "Waiting Payment",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[submitBooking] Supabase insert error:", insertError);
      throw new Error("Gagal menyimpan permohonan ke database");
    }

    console.log("[submitBooking] Supabase insert success, id:", requestData.id);

    const consultationRequestId = requestData.id;

    // Create Xendit Invoice
    const basePriceStr = process.env.NEXT_PUBLIC_CONSULTATION_BASE_PRICE || "20000";
    const amount = parseInt(basePriceStr, 10);
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yukceritain.vercel.app";
    
    // Fallback if Vercel auto-injects dynamic preview URLs without explicit NEXT_PUBLIC_APP_URL
    if (appUrl.includes("vercel.app") && process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_APP_URL) {
      appUrl = "https://yukceritain.vercel.app";
    }
    
    // External ID format INV-{requestNumber}-{timestamp}
    const externalId = `INV-${requestNumber}-${Date.now()}`;
    
    const invoiceReq = {
      external_id: externalId,
      amount: amount,
      description: `Pembayaran Konsultasi ${requestNumber} (1 Jam)`,
      customer: {
        given_names: parsedData.nama_lengkap,
        email: parsedData.email,
        mobile_number: parsedData.nomor_hp,
      },
      success_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
      failure_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
    };

    console.log("[submitBooking] Creating Xendit invoice...");
    const invoice = await createXenditInvoice(invoiceReq);
    console.log("[submitBooking] Xendit invoice created:", invoice.id);

    // Save payment to database
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        consultation_request_id: consultationRequestId,
        xendit_invoice_id: invoice.id,
        external_id: externalId,
        amount: amount,
        payment_status: "PENDING",
        invoice_url: invoice.invoice_url,
        expired_at: invoice.expiry_date,
      });

    if (paymentError) {
      console.error("[submitBooking] Payment insert error:", paymentError);
      // We don't block the user, they can retry payment from status check page
    } else {
      console.log("[submitBooking] Payment record saved successfully");
    }

    console.log("[submitBooking] All steps completed successfully for:", requestNumber);
    return { success: true, requestNumber, invoiceUrl: invoice.invoice_url };
  } catch (error: unknown) {
    console.error("[submitBooking] Booking submission error:", error);
    // Surface detailed error info for Zod validation errors
    if (error && typeof error === "object" && "issues" in error) {
      console.error("[submitBooking] Zod validation issues:", JSON.stringify((error as any).issues, null, 2));
    }
    return { success: false, error: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak terduga" };
  }
}



import { revalidatePath } from "next/cache";

export async function updateBookingStatus(id: string, status: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("consultation_requests")
      .update({ db_status: status })
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/konseling");
    return { success: true };
  } catch (error) {
    console.error("Failed to update booking status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui status" };
  }
}
