import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/auth/roles"
import CalendarClient from "./CalendarClient"

export const metadata = {
  title: 'Calendar | Admin YukCeritain',
}

export const revalidate = 0

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_konseling')) {
    redirect('/admin')
  }

  const { data: requests, error } = await supabase
    .from("consultation_requests")
    .select("*, payments(*)")
    .in("db_status", ["Menunggu Verifikasi", "Disetujui", "Waiting Payment", "Selesai"])
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching consultation requests for calendar:", error)
  }

  const formattedRequests = (requests || []).map(req => ({
    ...req,
    payment: req.payments && req.payments.length > 0 ? req.payments[0] : null
  }))

  return <CalendarClient initialData={formattedRequests} />
}
