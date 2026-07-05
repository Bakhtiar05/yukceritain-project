import React from "react";
import Image from "next/image";
import Link from "next/link";

const Instagram = ({ className = "" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function InstagramHighlightsSection() {
  const placeholders = [
    { id: 1, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
    { id: 2, image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80" },
    { id: 3, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" },
    { id: 4, image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80" },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Instagram className="w-8 h-8 text-pink-500" />
              Latest from Instagram
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Ikuti keseruan acara-acara YukceritaIN dan dapatkan insight menarik seputar kesehatan mental di Instagram kami.
            </p>
          </div>
          <a href="https://instagram.com/yukceritain" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap w-fit">
            Follow @yukceritain
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {placeholders.map((item) => (
            <Link href="https://instagram.com/yukceritain" target="_blank" key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image 
                src={item.image} 
                alt="Instagram post" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 drop-shadow-md" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
