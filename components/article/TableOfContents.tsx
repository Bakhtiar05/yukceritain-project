'use client'

import { useEffect, useState, useMemo } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

/**
 * Generates a slug identical to rehype-slug's algorithm:
 * lowercase, strip non-alphanumeric (except spaces/hyphens), collapse whitespace to hyphens.
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Detects whether content is legacy HTML or Markdown.
 */
function isHtmlContent(content: string): boolean {
  const trimmed = content.trim()
  return (
    trimmed.startsWith('<') ||
    /<(?:div|section|p|h[1-6]|ul|ol|article|blockquote|table)\b/i.test(trimmed)
  )
}

/**
 * Extracts headings from Markdown content (## and ###).
 */
function extractMarkdownHeadings(content: string): TOCItem[] {
  const items: TOCItem[] = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].replace(/[*_`~\[\]]/g, '').trim()
    items.push({
      id: generateSlug(text),
      text,
      level: match[1].length,
    })
  }
  return items
}

/**
 * Extracts headings from legacy HTML content (existing logic).
 */
function extractHtmlHeadings(content: string): TOCItem[] {
  const items: TOCItem[] = []
  // Try section > h2 pattern first
  const sectionRegex = /id="([^"]*)"[^>]*>\s*<h2>([^<]*)/gi
  let match
  while ((match = sectionRegex.exec(content)) !== null) {
    items.push({ id: match[1], text: match[2], level: 2 })
  }
  // Fallback to h2 with id
  if (items.length === 0) {
    const h2Regex = /<h2[^>]*id="([^"]*)"[^>]*>([^<]*)/gi
    while ((match = h2Regex.exec(content)) !== null) {
      items.push({ id: match[1], text: match[2], level: 2 })
    }
  }
  return items
}

export default function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState('')
  const [copied, setCopied] = useState(false)

  const headings = useMemo(() => {
    if (isHtmlContent(content)) {
      return extractHtmlHeadings(content)
    }
    return extractMarkdownHeadings(content)
  }, [content])

  useEffect(() => {
    const sections = headings.map(h => document.getElementById(h.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(e => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0.4 }
    )
    sections.forEach(s => s && observer.observe(s))
    return () => observer.disconnect()
  }, [headings])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(document.title)
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
  }

  if (!headings.length) return null

  return (
    <aside className="hidden lg:block w-[220px] flex-shrink-0">
      <div className="sticky bg-neutral-50 dark:bg-card border border-neutral-200 dark:border-border rounded-lg p-5" style={{ top: 'calc(72px + 3px + 24px)' }}>
        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Daftar Isi</h4>
        <nav className="space-y-0.5 mb-6">
          {headings.map((h) => (
            <button
              key={h.id}
              onClick={() => scrollTo(h.id)}
              className={`block w-full text-left text-[0.83rem] px-3 py-2 rounded-md transition-all ${
                h.level === 3 ? 'pl-6' : ''
              } ${
                activeId === h.id
                  ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              {h.text}
            </button>
          ))}
        </nav>

        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Bagikan</h4>
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
              copied ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-800 text-green-600 dark:text-green-400' : 'border-neutral-200 dark:border-border text-neutral-500 dark:text-neutral-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400'
            }`}
            title="Salin tautan"
          >
            {copied ? '✓' : '🔗'}
          </button>
          <button
            onClick={shareWhatsApp}
            className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-border flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-all"
            title="Bagikan via WhatsApp"
          >
            💬
          </button>
        </div>
      </div>
    </aside>
  )
}
