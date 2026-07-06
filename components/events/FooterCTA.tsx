import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FooterCTA() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Want to stay updated?</h2>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          Never miss future workshops, webinars, and community activities from YukceritaIN. Join our community and continue growing with us.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/blog" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-1 text-base"
          >
            Browse Articles
          </Link>
          <Link 
            href="/konsultasi" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[#BFDBFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] rounded-full font-bold transition-all duration-300 hover:-translate-y-1 text-base group"
          >
            Book Counseling
            <ArrowRight className="w-4 h-4 ml-2 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  );
}
