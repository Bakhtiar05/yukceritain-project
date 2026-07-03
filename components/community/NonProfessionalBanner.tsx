import React from 'react'

export default function NonProfessionalBanner() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
      <div className="text-3xl mb-3">🤍</div>
      <h3 className="text-slate-800 font-semibold mb-2">Professional Responses Only</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
        To ensure a safe and supportive environment, top-level responses are reserved for verified mental health professionals. You can still show your support by reacting or replying to existing professional responses.
      </p>
      <div className="bg-white border border-slate-100 rounded-xl p-4 inline-block max-w-sm w-full mx-auto shadow-sm">
        <p className="text-xs text-slate-600 font-medium mb-3">
          Want to become a verified contributor?
        </p>
        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
          Learn More
        </button>
      </div>
    </div>
  )
}
