"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";

interface MobileHeaderProps {
  title?: string;
  backUrl?: string;
}

export default function MobileHeader({ title = "Community Events", backUrl = "/" }: MobileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`md:hidden sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm" 
          : "bg-white/50 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
        <Link 
          href={backUrl}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>

        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h1>

        <Link 
          href="/events/favorites"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-slate-200 transition-colors"
        >
          <Bookmark className="w-5 h-5 text-slate-700" />
        </Link>
      </div>
    </header>
  );
}
