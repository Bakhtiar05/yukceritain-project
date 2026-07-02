import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/auth/roles"
import AnalyticsClient from "./AnalyticsClient"

export const metadata = {
  title: 'Analytics | Admin YukCeritain',
}

export const revalidate = 0

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_konseling')) {
    redirect('/admin')
  }

  // Fetch all requests and payments to compute analytics on the client or server
  // In a real huge dataset, you would aggregate this on the database layer.
  // For this redesign, we'll fetch them and pass them down to the client.
  const { data: requests, error } = await supabase
    .from("consultation_requests")
    .select("tanggal_konsultasi, db_status, metode_konsultasi, created_at, payments(amount, payment_status)")

  if (error) {
    console.error("Error fetching analytics data:", error)
  }

  return <AnalyticsClient initialData={requests || []} />
}
