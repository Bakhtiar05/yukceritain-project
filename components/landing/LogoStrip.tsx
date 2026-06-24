export default function LogoStrip() {
  const logos = ['🏥 Kemenkes RI', '⚕️ IDI', '🧠 HIMPSI', '🌐 WHO Partner', '🔒 ISO 27001', '📰 Kompas', '📺 CNN Indonesia']

  return (
    <section className="bg-[#F0F7FF] py-10 border-t border-blue-100">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">
        Dipercaya dan direkomendasikan oleh
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track">
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={i}
              className="inline-flex items-center whitespace-nowrap px-5 py-2 bg-white rounded-full text-sm font-semibold text-neutral-600 border border-neutral-200 shadow-sm"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
