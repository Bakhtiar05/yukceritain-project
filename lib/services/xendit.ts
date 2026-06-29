export interface XenditInvoiceRequest {
  external_id: string;
  amount: number;
  description: string;
  customer: {
    given_names: string;
    email: string;
    mobile_number?: string;
  };
  customer_notification_preference?: {
    invoice_created: string[];
    invoice_reminder: string[];
    invoice_paid: string[];
    invoice_expired: string[];
  };
  success_redirect_url: string;
  failure_redirect_url?: string;
  currency?: string;
}

export interface XenditInvoiceResponse {
  id: string;
  external_id: string;
  user_id: string;
  status: string;
  merchant_name: string;
  merchant_profile_picture_url: string;
  amount: number;
  invoice_url: string;
  expiry_date: string;
  created: string;
  updated: string;
  currency: string;
}

export async function createXenditInvoice(data: XenditInvoiceRequest): Promise<XenditInvoiceResponse> {
  const apiKey = process.env.XENDIT_SECRET_KEY;
  if (!apiKey) {
    throw new Error("XENDIT_SECRET_KEY is not configured.");
  }

  // Xendit API requires Basic Auth where username is the secret key and password is empty
  const base64Auth = Buffer.from(`${apiKey}:`).toString("base64");

  const response = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${base64Auth}`,
    },
    body: JSON.stringify({
      ...data,
      currency: data.currency || "IDR",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Xendit Invoice Creation Failed:", response.status, errorData);
    throw new Error(`Failed to create Xendit invoice: ${response.statusText}`);
  }

  return response.json();
}
