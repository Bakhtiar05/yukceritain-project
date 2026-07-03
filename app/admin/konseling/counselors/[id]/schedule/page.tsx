import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/roles'
import { getCounselorById } from '@/lib/actions/counselors'
import { getCounselorAvailability } from '@/lib/actions/availability'
import ScheduleClient from './ScheduleClient'

export const metadata = {
  title: 'Manage Schedule | Admin YukCeritain',
}

export default async function CounselorSchedulePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const role = await getUserRole()
  
  if (role !== 'super_admin' && role !== 'admin_konseling') {
    redirect('/admin')
  }

  const counselor = await getCounselorById(resolvedParams.id)
  
  if (!counselor) {
    redirect('/admin/konseling/counselors')
  }

  const availability = await getCounselorAvailability(resolvedParams.id)

  return (
    <ScheduleClient 
      counselor={counselor} 
      initialAvailability={availability} 
    />
  )
}
