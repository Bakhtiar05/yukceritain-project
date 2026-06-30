"use server";

import { createClient } from "@/lib/supabase/server";
import { bookingSchema, BookingFormData } from "@/lib/schemas/booking";
import { format } from "date-fns";
import { createXenditInvoice } from "@/lib/services/xendit";

export async function submitBooking(data: BookingFormData) {
  try {
    // Validate again on the server
    const parsedData = bookingSchema.parse(data);
    
    const supabase = await createClient();

    // Generate request number ATM-YYYYMMDD-XXXX
    const todayStr = format(new Date(), "yyyyMMdd");
    
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
    const requestNumber = `ATM-${todayStr}-${randomString}`;

    const { error: insertError, data: requestData } = await supabase
      .from("consultation_requests")
      .insert({
        request_number: requestNumber,
        
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
        jumlah_sesi: parsedData.jumlah_sesi,
        metode_konsultasi: parsedData.metode_konsultasi,
        
        urutan_konseling: parsedData.urutan_konseling,
        sumber_informasi: parsedData.sumber_informasi,
        sumber_informasi_lainnya: parsedData.sumber_informasi_lainnya,
        db_status: "Waiting Payment",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      throw new Error("Gagal menyimpan permohonan ke database");
    }

    const consultationRequestId = requestData.id;

    // Create Xendit Invoice
    const basePriceStr = process.env.NEXT_PUBLIC_CONSULTATION_BASE_PRICE || "20000";
    const amount = parseInt(basePriceStr, 10) * parsedData.jumlah_sesi;
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
      description: `Pembayaran Konsultasi ${requestNumber} (${parsedData.jumlah_sesi} Sesi)`,
      customer: {
        given_names: parsedData.nama_lengkap,
        email: parsedData.email,
        mobile_number: parsedData.nomor_hp,
      },
      success_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
      failure_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
    };

    const invoice = await createXenditInvoice(invoiceReq);

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
      console.error("Payment insert error:", paymentError);
      // We don't block the user, they can retry payment from status check page
    }

    return { success: true, requestNumber, invoiceUrl: invoice.invoice_url };
  } catch (error) {
    console.error("Booking submission error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak terduga" };
  }
}

const TIME_SLOTS = [
  "09:00 WIB",
  "10:00 WIB",
  "11:00 WIB",
  "13:00 WIB",
  "14:00 WIB",
  "15:00 WIB",
];

export async function getBookedSlots(date: Date) {
  try {
    const supabase = await createClient();
    const dateStr = format(date, "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("consultation_requests")
      .select("waktu_konsultasi, jumlah_sesi")
      .eq("tanggal_konsultasi", dateStr)
      .in("db_status", ["Menunggu Verifikasi", "Disetujui"]);

    if (error) throw error;

    const bookedSlots: string[] = [];
    data.forEach((row: any) => {
      bookedSlots.push(row.waktu_konsultasi);
      
      // If they booked 2 sessions, block the consecutive slot as well
      if (row.jumlah_sesi === 2) {
        const startIndex = TIME_SLOTS.indexOf(row.waktu_konsultasi);
        if (startIndex !== -1 && startIndex < TIME_SLOTS.length - 1) {
          bookedSlots.push(TIME_SLOTS[startIndex + 1]);
        }
      }
    });

    return bookedSlots;
  } catch (error) {
    console.error("Failed to fetch booked slots:", error);
    return [];
  }
}

import { revalidatePath } from "next/cache";

export async function updateBookingStatus(id: string, status: string) {
  try {
    const supabase = await createClient();
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
