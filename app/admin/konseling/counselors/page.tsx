import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/auth/roles"
import CounselorsClient from "./CounselorsClient"

export const metadata = {
  title: 'Counselors | Admin YukCeritain',
}

export default async function CounselorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = await getUserRole()

  if (!user || (role !== 'super_admin' && role !== 'admin_konseling')) {
    redirect('/admin')
  }

  // Currently we mock counselors data since there is no `counselors` table in the DB.
  // In a real application, you would fetch this from Supabase.

  return <CounselorsClient />
}
