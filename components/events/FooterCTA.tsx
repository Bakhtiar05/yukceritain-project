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
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors"
          >
            Browse Articles
          </Link>
          <Link 
            href="/konsultasi" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors group"
          >
            Book Counseling
            <ArrowRight className="w-4 h-4 ml-2 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  );
}
