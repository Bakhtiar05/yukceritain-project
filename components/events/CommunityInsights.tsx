import React from "react";
import { Users, Calendar, Megaphone, Heart } from "lucide-react";

interface CommunityInsightsProps {
  upcomingCount: number;
  completedCount: number;
  participantsCount: number;
  speakersCount: number;
}

export default function CommunityInsights({
  upcomingCount,
  completedCount,
  participantsCount,
  speakersCount,
}: CommunityInsightsProps) {
  const insights = [
    {
      id: 1,
      label: "Upcoming Events",
      value: upcomingCount,
      icon: Calendar,
    },
    {
      id: 2,
      label: "Events Held",
      value: completedCount,
      icon: Heart,
    },
    {
      id: 3,
      label: "Community Participants",
      value: participantsCount,
      icon: Users,
    },
    {
      id: 4,
      label: "Expert Speakers",
      value: speakersCount,
      icon: Megaphone,
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-x-0 lg:divide-x divide-slate-100">
          {insights.map((insight) => (
            <div key={insight.id} className="flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
                <insight.icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{insight.value}+</h3>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{insight.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
