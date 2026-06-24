'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById('article-content')
      if (!article) return
      const rect = article.getBoundingClientRect()
      const total = article.scrollHeight
      const scrolled = Math.max(0, -rect.top)
      setProgress(Math.min(100, (scrolled / (total - window.innerHeight)) * 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="reading-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
      <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  )
}
