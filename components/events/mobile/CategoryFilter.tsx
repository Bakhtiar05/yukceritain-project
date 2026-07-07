"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "workshop", label: "Workshop" },
  { id: "webinar", label: "Webinar" },
  { id: "community", label: "Community" },
  { id: "support", label: "Support Group" },
  { id: "meetup", label: "Meetup" },
  { id: "mental", label: "Mental Health" },
  { id: "career", label: "Career" },
  { id: "online", label: "Online" },
  { id: "offline", label: "Offline" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  const handleFilterClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("filter");
    } else {
      params.set("filter", id);
    }
    router.push(`/events?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full pt-2 pb-2">
      <div className="flex px-4 gap-2.5 overflow-x-auto pb-4">
        {CATEGORIES.map((category) => {
          const isSelected = 
            (category.id === "all" && !searchParams.get("filter")) || 
            currentFilter === category.id;
            
          return (
            <button
              key={category.id}
              onClick={() => handleFilterClick(category.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] border-transparent"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
