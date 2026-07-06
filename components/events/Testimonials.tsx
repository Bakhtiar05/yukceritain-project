import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      occupation: "University Student",
      text: "The mental health workshops completely changed my perspective on managing stress. It's such a welcoming and warm community.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "David Chen",
      occupation: "Software Engineer",
      text: "Attending the online webinars has been a fantastic experience. The speakers are highly knowledgeable, and the sessions are very interactive.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=david"
    },
    {
      name: "Amina Yusuf",
      occupation: "HR Professional",
      text: "I love the offline meetups. It feels safe to share stories, and I’ve made some really great friends here. Highly recommend joining!",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=amina"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">What Our Community Says</h2>
          <p className="text-[#64748B] text-lg">Real stories from people who have joined our events.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-[24px] border border-[#E5E7EB] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#0F172A] text-lg font-medium leading-relaxed mb-8 flex-1">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                  <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A]">{testimonial.name}</h4>
                  <p className="text-sm text-[#64748B]">{testimonial.occupation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
