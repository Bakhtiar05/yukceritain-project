import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const supabase = await createClient();

    // Get existing payment
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
