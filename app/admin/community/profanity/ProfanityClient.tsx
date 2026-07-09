'use client'

import React, { useState } from 'react'
import { addBlockedWord, removeBlockedWord } from '@/lib/actions/profanity'
import { Plus, X, Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type WordItem = { id: string; word: string; created_at: string }

export default function ProfanityClient({ initialWords }: { initialWords: WordItem[] }) {
  const [words, setWords] = useState<WordItem[]>(initialWords)
  const [newWord, setNewWord] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWord.trim()) return

    try {
      setIsSubmitting(true)
      await addBlockedWord(newWord)
      toast({
        title: 'Berhasil',
        description: `Kata "${newWord}" berhasil ditambahkan.`,
      })
      
      // Optimistic update
      setWords((prev) => [{ id: Math.random().toString(), word: newWord.toLowerCase(), created_at: new Date().toISOString() }, ...prev])
      setNewWord('')
    } catch (err: any) {
      toast({
        title: 'Gagal Menambahkan',
        description: err.message || 'Terjadi kesalahan.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (id: string, wordText: string) => {
    try {
      setRemovingId(id)
      await removeBlockedWord(id)
      toast({
        title: 'Dihapus',
        description: `Kata "${wordText}" berhasil dihapus dari daftar.`,
      })
      setWords((prev) => prev.filter((w) => w.id !== id))
    } catch (err: any) {
      toast({
        title: 'Gagal Menghapus',
        description: err.message || 'Terjadi kesalahan.',
        variant: 'destructive',
      })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <form onSubmit={handleAdd} className="flex gap-3 max-w-lg">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Masukkan kata kotor baru..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newWord.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Tambah
          </button>
        </form>
      </div>

      <div className="p-6">
        {words.length === 0 ? (
          <div className="py-8 text-center text-slate-500 flex flex-col items-center border border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
            <p>Belum ada kata terlarang yang ditambahkan.</p>
          </div>
        ) : (
          <ul className="flex flex-wrap gap-2.5 max-h-[600px] overflow-y-auto custom-scrollbar p-1">
            {words.map((item) => (
              <li key={item.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-full text-sm font-medium transition-all shadow-sm">
                <span>{item.word}</span>
                <button
                  onClick={() => handleRemove(item.id, item.word)}
                  disabled={removingId === item.id}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors disabled:opacity-50 flex-shrink-0"
                  title="Hapus kata ini"
                >
                  {removingId === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
