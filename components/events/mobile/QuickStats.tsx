"use client";

import React from "react";
import { Users, Calendar, Mic2, HeartHandshake } from "lucide-react";

export default function QuickStats() {
  const stats = [
    { label: "Events", value: "150+", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Participants", value: "20K+", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Speakers", value: "80+", icon: Mic2, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Communities", value: "50+", icon: HeartHandshake, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <section className="px-4 py-8 bg-white dark:bg-background border-t border-slate-100 dark:border-slate-800">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-[20px] bg-slate-50 dark:bg-card border border-slate-100 dark:border-slate-800 text-center">
              <div className={`w-10 h-10 rounded-full ${stat.bg} dark:bg-opacity-20 ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
