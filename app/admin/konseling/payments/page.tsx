import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/auth/roles"
import PaymentsClient from "./PaymentsClient"

export const metadata = {
  title: 'Payments Management | Admin YukCeritain',
}

export const revalidate = 0

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_konseling')) {
    redirect('/admin')
  }

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*, consultation_requests(request_number, nama_lengkap)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
  }

  return <PaymentsClient initialData={payments || []} />
}
