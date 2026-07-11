"use client";

import React from "react";
import { GraduationCap, Users, HeartPulse } from "lucide-react";

export default function WhyJoin() {
  const benefits = [
    {
      title: "Learn from experts",
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Meet new people",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Support your mental health",
      icon: HeartPulse,
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <section className="px-4 py-8 bg-slate-50 dark:bg-background border-t border-slate-100 dark:border-slate-800 mb-20">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Why Join Us?</h2>
      </div>

      <div className="flex flex-col gap-3">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div key={idx} className="flex items-center gap-4 bg-white dark:bg-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${benefit.bg} dark:bg-opacity-20 ${benefit.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
