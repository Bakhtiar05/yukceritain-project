'use client'

const categories = [
  { id: 'semua', label: 'Semua' },
  { id: 'kecemasan', label: 'Kecemasan' },
  { id: 'selfcare', label: 'Self-Care' },
  { id: 'mindfulness', label: 'Mindfulness' },
  { id: 'relasi', label: 'Relasi' },
  { id: 'depresi', label: 'Depresi' },
]

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div role="tablist" className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={activeCategory === cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-[0.85rem] font-semibold border transition-all duration-fast ${
            activeCategory === cat.id
              ? 'text-blue-500 bg-blue-50 border-blue-200'
              : 'text-neutral-600 bg-white border-neutral-200 hover:bg-blue-50 hover:text-blue-500'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
