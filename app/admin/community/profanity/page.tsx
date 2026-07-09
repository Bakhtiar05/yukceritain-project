import React from 'react'
import ProfanityClient from './ProfanityClient'
import { getBlockedWordsList } from '@/lib/actions/profanity'

export const metadata = {
  title: 'Manajemen Filter Kata - Admin',
}

export default async function ProfanityAdminPage() {
  const initialWords = await getBlockedWordsList()
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Filter Kata Kotor</h1>
        <p className="text-slate-500 mt-2">
          Kelola daftar kata yang dilarang di Komunitas. Kata-kata di bawah ini akan memblokir otomatis kiriman dari pengguna.
        </p>
      </div>
      
      <ProfanityClient initialWords={initialWords} />
    </div>
  )
}
