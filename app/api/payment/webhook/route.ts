import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const xenditToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
    const reqToken = req.headers.get("x-callback-token");

    if (xenditToken && reqToken !== xenditToken) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const payload = await req.json();

    // Prevent duplicate processing or unnecessary events
    if (!payload.id || !payload.external_id) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Route based on external_id prefix
    if (payload.external_id.startsWith("evt_")) {
      // EVENT PAYMENT LOGIC
      const { data: eventPayment, error: eventPaymentError } = await supabase
        .from("event_payments")
        .select("*")
        .eq("external_id", payload.external_id)
        .single();

      if (eventPaymentError || !eventPayment) {
        return NextResponse.json({ message: "Event payment not found" }, { status: 404 });
      }

      if (eventPayment.payment_status === "PAID" && payload.status === "PAID") {
        return NextResponse.json({ message: "Already processed" }, { status: 200 });
      }

      const paymentUpdate: any = {
        payment_status: payload.status,
        updated_at: new Date().toISOString(),
      };
      if (payload.payment_method) paymentUpdate.payment_method = payload.payment_method;
      if (payload.paid_at) paymentUpdate.paid_at = payload.paid_at;

      const { error: updateError } = await supabase
        .from("event_payments")
        .update(paymentUpdate)
        .eq("id", eventPayment.id);

      if (updateError) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
      }

      if (payload.status === "PAID") {
        // Find registration code to generate QR code URL (we could also fetch it)
        const { data: regData } = await supabase
          .from("event_registrations")
          .select("registration_code")
          .eq("id", eventPayment.registration_id)
          .single();

        await supabase
          .from("event_registrations")
          .update({
            payment_status: "PAID",
            qr_code: regData ? `QR-${regData.registration_code}` : null
          })
          .eq("id", eventPayment.registration_id);
      }

      return NextResponse.json({ message: "Success" }, { status: 200 });
    }

    // EXISTING COUNSELING PAYMENT LOGIC
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("external_id", payload.external_id)
      .single();

    if (paymentError || !payment) {
      console.error("Payment not found for webhook:", payload.external_id);
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    // Ignore if already paid or completed to prevent duplicate processing
    if (payment.payment_status === "PAID" && payload.status === "PAID") {
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    // Prepare updates
    const paymentUpdate: any = {
      payment_status: payload.status, // e.g., PAID, EXPIRED, FAILED
      updated_at: new Date().toISOString(),
    };

    if (payload.payment_method) paymentUpdate.payment_method = payload.payment_method;
    if (payload.paid_at) paymentUpdate.paid_at = payload.paid_at;

    // Update payment
    const { error: updateError } = await supabase
      .from("payments")
      .update(paymentUpdate)
      .eq("id", payment.id);

    if (updateError) {
      console.error("Failed to update payment:", updateError);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

    // Update consultation request status if PAID
    if (payload.status === "PAID") {
      const { error: bookingError } = await supabase
        .from("consultation_requests")
        .update({ db_status: "Waiting Admin Confirmation" })
        .eq("id", payment.consultation_request_id);

      if (bookingError) {
        console.error("Failed to update booking status:", bookingError);
      }
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
