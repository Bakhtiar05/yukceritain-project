import React from "react";
import { BookOpen, Users, Activity, Award } from "lucide-react";

export default function CommunityBenefits() {
  const benefits = [
    {
      title: "Learn from experts",
      description: "Gain insights from experienced psychologists and mental health advocates.",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Meet like-minded people",
      description: "Connect with individuals who share your journey and build a support system.",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Build healthy habits",
      description: "Participate in workshops designed to improve your daily well-being.",
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Get certificates",
      description: "Earn e-certificates for attending our official webinars and workshops.",
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-curved-lines pointer-events-none z-0"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Why Join Our Community?</h2>
          <p className="text-[#64748B] text-lg leading-relaxed">
            Discover the benefits of growing together in a supportive, mental-health friendly environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-[24px] border border-[#E5E7EB] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-[20px] ${benefit.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{benefit.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
