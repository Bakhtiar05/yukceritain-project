import type { Metadata } from 'next'
import LoginForm from '@/components/admin/LoginForm'

export const metadata: Metadata = { title: 'Login Admin' }

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <LoginForm />
    </div>
  )
}
