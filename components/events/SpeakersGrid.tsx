import React from "react";
import Image from "next/image";
import { Globe, Mail } from "lucide-react";

export default function SpeakersGrid() {
  const speakers = [
    {
      name: "Dr. Amanda Rose",
      specialization: "Clinical Psychologist",
      organization: "Mental Health Institute",
      avatar: "https://i.pravatar.cc/200?u=amanda"
    },
    {
      name: "Michael Chang",
      specialization: "Wellness Coach",
      organization: "Mindful Living",
      avatar: "https://i.pravatar.cc/200?u=michael"
    },
    {
      name: "Sarah Rahman",
      specialization: "Therapist & Author",
      organization: "Healing Spaces",
      avatar: "https://i.pravatar.cc/200?u=sarah2"
    },
    {
      name: "Dr. James Wilson",
      specialization: "Psychiatrist",
      organization: "General Hospital",
      avatar: "https://i.pravatar.cc/200?u=james"
    }
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Learn From Experts</h2>
            <p className="text-[#64748B] text-lg max-w-2xl">Our events are hosted by certified professionals who are passionate about sharing their knowledge.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-[#BFDBFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] rounded-full font-bold transition-all duration-300 hover:-translate-y-1 text-sm self-start md:self-auto">
            View All Speakers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakers.map((speaker, index) => (
            <div key={index} className="group bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 ring-4 ring-[#EFF6FF] group-hover:ring-[#60A5FA]/30 transition-all">
                <Image src={speaker.avatar} alt={speaker.name} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-1">{speaker.name}</h3>
              <p className="text-[#2563EB] font-medium text-sm mb-1">{speaker.specialization}</p>
              <p className="text-[#64748B] text-sm mb-6">{speaker.organization}</p>
              
              <div className="flex items-center gap-3 mt-auto">
                <a href="#" className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
