import { notFound } from 'next/navigation'
import CounselorForm from '@/components/admin/counselors/CounselorForm'
import { getCounselorById } from '@/lib/actions/counselors'

interface EditCounselorPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCounselorPage({ params }: EditCounselorPageProps) {
  const resolvedParams = await params
  const counselor = await getCounselorById(resolvedParams.id)

  if (!counselor) {
    notFound()
  }

  return (
    <div className="p-6">
      <CounselorForm counselor={counselor} />
    </div>
  )
}

