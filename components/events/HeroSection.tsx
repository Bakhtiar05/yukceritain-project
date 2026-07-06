"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Video, Bell, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full pt-32 md:pt-40 pb-16 md:pb-32 overflow-hidden bg-[#FFFFFF] flex flex-col items-center justify-center min-h-[50vh] md:min-h-[85vh]">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#EFF6FF] blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#EFF6FF] blur-[140px] opacity-60 pointer-events-none" />
      
      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#EFF6FF]/50 blur-[150px] pointer-events-none z-0" />

      {/* Floating Geometric Shapes */}
      <div className="absolute top-[10%] left-[20%] w-[120px] h-[120px] rounded-full deco-shape animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[20%] right-[25%] w-[80px] h-[80px] rounded-xl deco-shape transform rotate-12"></div>
      <div className="absolute top-[40%] right-[10%] w-[150px] h-[40px] rounded-full deco-shape transform -rotate-12"></div>

      {/* Floating Cards Layer (Behind Text) */}
      <div className="absolute inset-0 z-10 pointer-events-none max-w-[1440px] mx-auto hidden md:block">
        
        {/* Top Left - Notification */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
          className="absolute top-[2%] md:top-[15%] left-[2%] md:left-[5%] lg:left-[10%] w-48 md:w-64 scale-75 md:scale-100 origin-top-left bg-white/90 backdrop-blur-md rounded-[20px] p-3 md:p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#E5E7EB]"
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shrink-0 mt-1">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">New Workshop</h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                "Managing Stress at Work" is open!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Right - Certificate */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.3 }, y: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 } }}
          className="absolute top-[6%] md:top-[20%] right-[2%] md:right-[5%] lg:right-[12%] w-40 md:w-52 scale-75 md:scale-100 origin-top-right bg-white/90 backdrop-blur-md rounded-[20px] p-3 md:p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#E5E7EB] transform rotate-3"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">E-Certificate</h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                For all participants
              </p>
            </div>
          </div>
        </motion.div>

        {/* Middle Left - Upcoming Event */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.4 }, y: { repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.5 } }}
          className="absolute top-[18%] md:top-[50%] left-[2%] lg:left-[5%] w-56 md:w-72 scale-75 md:scale-100 origin-left bg-white rounded-[24px] p-4 md:p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#E5E7EB] transform -rotate-3"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[#0F172A] font-bold text-sm">Mental Health Talk</h3>
              <p className="text-xs text-[#64748B]">Tomorrow, 10:00 AM</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full bg-[#F8FAFC] rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] w-3/4"></div>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#64748B]">145 Registered</span>
              <span className="text-[#2563EB]">15 Seats left</span>
            </div>
          </div>
        </motion.div>

        {/* Middle Right - Reminder (Aligned with Middle Left) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.6 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 } }}
          className="absolute top-[22%] md:top-[50%] right-[2%] lg:right-[5%] w-48 md:w-64 scale-75 md:scale-100 origin-right bg-white/90 backdrop-blur-md rounded-[20px] p-3 md:p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#E5E7EB] transform rotate-2"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Don't miss out!</h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Save your spot for upcoming events.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content (Foreground) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#E5E7EB] text-[#2563EB] text-sm font-semibold shadow-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60A5FA] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
          </span>
          <span>Community Events</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-tight max-w-[900px] mb-8">
          Learn. Connect.<br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA] sm:ml-3">
            Grow Together.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#64748B] max-w-[600px] leading-relaxed mb-10">
          Join interactive webinars, expert-led workshops, community meetups, and supportive mental health discussions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto relative z-30 pointer-events-auto">
          <Link 
            href="#events" 
            className="w-full sm:w-auto px-8 h-[52px] rounded-[14px] bg-gradient-to-r from-[#2563EB] to-[#3b82f6] text-white font-semibold flex items-center justify-center shadow-lg shadow-blue-500/25 hover:translate-y-[-2px] hover:shadow-blue-500/40 transition-all duration-300"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </section>
  );
}
