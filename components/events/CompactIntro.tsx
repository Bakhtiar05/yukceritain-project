import React from "react";

export default function CompactIntro() {
  return (
    <section className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto text-center">
      <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 rounded-full mb-6">
        <span className="text-sm font-semibold tracking-wide text-slate-700 uppercase">Community Events</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
        Learn, Connect, and <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
          Grow Together
        </span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Temukan workshop, webinar, grup dukungan, dan acara edukatif yang dirancang untuk membantu Anda membangun kehidupan yang lebih sehat dan bahagia.
      </p>
    </section>
  );
}
