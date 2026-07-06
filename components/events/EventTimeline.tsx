import React from "react";
import { MousePointerClick, Ticket, Users, Award } from "lucide-react";

export default function EventTimeline() {
  const steps = [
    {
      title: "Register",
      description: "Find an event that suits you and click register.",
      icon: MousePointerClick
    },
    {
      title: "Receive Ticket",
      description: "Get your e-ticket and event link via email instantly.",
      icon: Ticket
    },
    {
      title: "Join & Network",
      description: "Attend the session, learn, and connect with others.",
      icon: Users
    },
    {
      title: "Get Certificate",
      description: "Receive an e-certificate after completing the session.",
      icon: Award
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">How It Works</h2>
          <p className="text-[#64748B] text-lg">Your journey to learning and growing with our community.</p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#EFF6FF] via-[#60A5FA] to-[#EFF6FF] z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative group">
                <div className="w-24 h-24 rounded-full bg-white border-8 border-[#F8FAFC] shadow-xl shadow-blue-900/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#EFF6FF] transition-all duration-300">
                  <step.icon className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed max-w-[200px]">{step.description}</p>
                
                {/* Arrow for mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden mt-8 w-px h-12 bg-gradient-to-b from-[#60A5FA] to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
