import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/auth/roles"
import BookingsClient from "./BookingsClient"

export const metadata = {
  title: 'Bookings Management | Admin YukCeritain',
}

export const revalidate = 0

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_konseling')) {
    redirect('/admin')
  }

  const { data: requests, error } = await supabase
    .from("consultation_requests")
    .select("*, payments(*), counselors(full_name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching consultation requests:", error)
  }

  // Transform the data to ensure payments is an array or object safely handled
  const formattedRequests = (requests || []).map(req => ({
    ...req,
    payment: req.payments && req.payments.length > 0 ? req.payments[0] : null
  }))

  return <BookingsClient initialData={formattedRequests} />
}
