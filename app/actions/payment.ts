"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createXenditInvoice, getXenditInvoice } from "@/lib/services/xendit";

export async function getPaymentAndBookingDetails(requestNumber: string) {
  try {
    const supabase = createAdminClient();

    const { data: booking, error: bookingError } = await supabase
      .from("consultation_requests")
      .select("*, payments(*)")
      .eq("request_number", requestNumber)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: "Data permohonan tidak ditemukan." };
    }

    const payment = booking.payments?.[0]; // Get the first related payment if exists
    let paymentStatus = payment?.payment_status || "PENDING";

    // If it's pending and not a dummy invoice, try to check Xendit directly
    if (paymentStatus === "PENDING" && payment?.xendit_invoice_id && !payment.xendit_invoice_id.startsWith("PENDING-") && !payment.xendit_invoice_id.startsWith("FREE-")) {
      try {
        const xenditInvoice = await getXenditInvoice(payment.xendit_invoice_id);
        if (xenditInvoice.status === "PAID" || xenditInvoice.status === "SETTLED") {
          paymentStatus = "PAID";
          await supabase.from("payments").update({ payment_status: "PAID", paid_at: new Date().toISOString() }).eq("id", payment.id);
          await supabase.from("consultation_requests").update({ db_status: "Waiting Admin Confirmation" }).eq("id", booking.id);
        } else if (xenditInvoice.status === "EXPIRED") {
          paymentStatus = "EXPIRED";
          await supabase.from("payments").update({ payment_status: "EXPIRED" }).eq("id", payment.id);
        }
      } catch (e) {
        console.error("Failed to check xendit status directly", e);
      }
    }

    return {
      success: true,
      data: {
        requestNumber: booking.request_number,
        date: booking.tanggal_konsultasi,
        time: booking.waktu_konsultasi,
        method: booking.metode_konsultasi,
        bookingStatus: booking.db_status,
        paymentStatus,
        invoiceUrl: payment?.invoice_url || null,
        paymentMethod: payment?.payment_method || null,
        amount: payment?.amount || null,
        fullName: booking.nama_lengkap,
        email: booking.email,
        whatsappNumber: booking.nomor_hp,
      },
    };
  } catch (error) {
    console.error("Failed to fetch payment details:", error);
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function generatePaymentLink(requestNumber: string, discountCode?: string) {
  try {
    const supabase = createAdminClient();

    const { data: booking, error: bookingError } = await supabase
      .from("consultation_requests")
      .select("*, payments(*)")
      .eq("request_number", requestNumber)
      .single();

    if (bookingError || !booking) {
      return { success: false, error: "Data permohonan tidak ditemukan." };
    }

    let amount = booking.payments?.[0]?.amount || 20000;
    const paymentId = booking.payments?.[0]?.id;

    if (!paymentId) {
      return { success: false, error: "Data pembayaran tidak ditemukan." };
    }

    if (booking.payments[0].payment_status === "PAID") {
      return { success: true, invoiceUrl: null, amount: 0 };
    }

    if (discountCode) {
      const { data: discount } = await supabase
        .from("discount_codes")
        .select("*")
        .ilike("code", discountCode)
        .eq("is_active", true)
        .single();
        
      if (discount) {
        if (discount.max_uses === null || discount.current_uses < discount.max_uses) {
          const discountAmount = Math.floor((amount * discount.discount_percentage) / 100);
          amount = Math.max(0, amount - discountAmount);
          
          // Increment usage
          const { error: rpcError } = await supabase.rpc('increment_discount_usage', { code_val: discount.code });
          if (rpcError) {
            await supabase.from("discount_codes")
              .update({ current_uses: discount.current_uses + 1 })
              .eq("id", discount.id);
          }

          // Update discount code in booking
          await supabase.from("consultation_requests")
            .update({ discount_code: discount.code })
            .eq("id", booking.id);
        }
      }
    }

    let appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yukceritain.vercel.app";
    if (appUrl.includes("vercel.app") && process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_APP_URL) {
      appUrl = "https://yukceritain.vercel.app";
    }

    const externalId = `INV-${requestNumber}-${Date.now()}`;

    if (amount === 0) {
      await supabase
        .from("consultation_requests")
        .update({ db_status: "Menunggu Verifikasi" })
        .eq("id", booking.id);
        
      await supabase
        .from("payments")
        .update({
          xendit_invoice_id: `FREE-${externalId}`,
          amount: 0,
          payment_status: "PAID",
          invoice_url: "-",
          paid_at: new Date().toISOString(),
        })
        .eq("id", paymentId);
        
      return { success: true, invoiceUrl: null, amount: 0 };
    }

    const invoiceReq = {
      external_id: externalId,
      amount: amount,
      description: `Pembayaran Konsultasi ${requestNumber} (1 Jam)`,
      customer: {
        given_names: booking.nama_lengkap,
        email: booking.email,
        mobile_number: booking.nomor_hp,
      },
      success_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
      failure_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
    };

    const invoice = await createXenditInvoice(invoiceReq);

    await supabase
      .from("payments")
      .update({
        xendit_invoice_id: invoice.id,
        amount: amount,
        invoice_url: invoice.invoice_url,
        expired_at: invoice.expiry_date,
      })
      .eq("id", paymentId);

    return { success: true, invoiceUrl: invoice.invoice_url, amount };
  } catch (error: any) {
    console.error("Failed to generate payment link:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}
