import React from 'react'

export default function ExplorePage() {
  const categories = [
    'Stress', 'College', 'Work', 'Relationship', 'Family', 'Self Growth'
  ]

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="p-6 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore</h2>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search stories, topics, or users..." 
            className="w-full bg-slate-100 border-0 rounded-full py-3 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button 
              key={category}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-12 text-center text-slate-500">
        <div className="text-4xl mb-4">🔍</div>
        <p>Search results and trending topics will appear here.</p>
      </div>
    </div>
  )
}
