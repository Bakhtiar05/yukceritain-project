'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Post } from '@/lib/types'
import BlogCard from './BlogCard'
import CategoryFilter from './CategoryFilter'
import SearchBar from './SearchBar'

export default function BlogGrid({ initialPosts }: { initialPosts: Post[] }) {
  const searchParams = useSearchParams()
  
  const [activeCategory, setActiveCategory] = useState('semua')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  const filtered = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory = activeCategory === 'semua' || post.category === activeCategory
      const matchesSearch = !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [initialPosts, activeCategory, searchQuery])

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat)
  }, [])

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q)
  }, [])

  const reset = () => { setActiveCategory('semua'); setSearchQuery('') }

  return (
    <div>
      {/* Filter Bar */}
      <div className="relative z-10 bg-white dark:bg-background border-b border-neutral-200 dark:border-border shadow-sm -mx-6 px-6 py-4">
        <div className="max-w-container mx-auto flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          <div className="hidden md:block w-72">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
        </div>
      </div>

      {/* Post Count */}
      <p className="text-sm text-neutral-400 mt-6 mb-4">
        Menampilkan {filtered.length} artikel
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <div key={post.id} className="animate-fade-enter">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-foreground mb-2">Artikel tidak ditemukan</h3>
          <p className="text-sm text-neutral-500 mb-6">Coba ubah filter atau kata kunci pencarian</p>
          <button onClick={reset} className="btn btn-outline text-sm">
            Reset Filter
          </button>
        </div>
      )}
    </div>
  )
}
