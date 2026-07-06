import React from "react";

export default function Newsletter() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative rounded-[32px] overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] to-[#1E40AF]"></div>
          
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-white/10 blur-[60px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#60A5FA]/30 blur-[60px] pointer-events-none"></div>

          <div className="relative z-10 py-16 px-6 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                Never Miss an Event
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Receive updates for upcoming workshops, webinars, and exclusive community events directly in your inbox.
              </p>
            </div>
            
            <div className="w-full lg:w-auto flex-shrink-0 relative">
              <form className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto p-2 bg-white/10 backdrop-blur-md rounded-[20px] border border-white/20 shadow-2xl">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full sm:w-72 bg-white rounded-[14px] px-5 py-4 text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#60A5FA] transition-all"
                  required
                />
                <button 
                  type="submit"
                  className="px-8 py-3.5 bg-[#0F172A] hover:bg-black text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-blue-200 text-xs mt-3 text-center lg:text-left font-medium">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
