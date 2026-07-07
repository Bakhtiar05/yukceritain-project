"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Handshake, Users, ShieldCheck, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function PartnerPage() {
  const adminPhone = "6281234567890"; // Dummy number, user needs to change this
  
  const waMessage = `Hello YukCerita Team,

I would like to become a partner and publish an event on YukCerita.

Organization Name: 
Person in Charge: 
Email: 
Phone Number: 
Event Title: 
Event Date: 
Location: 
Registration Link: 

I look forward to collaborating with YukCerita. Thank you.`;

  const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(waMessage)}`;

  const benefits = [
    { icon: Users, title: "Reach more participants", desc: "Access our growing community of mental health enthusiasts." },
    { icon: ShieldCheck, title: "Trusted platform", desc: "Promote your events on a platform users trust for quality." },
    { icon: TrendingUp, title: "Increase visibility", desc: "Stand out with our featured placement options." },
    { icon: Zap, title: "Fast review process", desc: "Simple and quick approval to get your event live." }
  ];

  const steps = [
    { title: "Submit Request", desc: "Send us your event details" },
    { title: "Review", desc: "Our team verifies the content" },
    { title: "Approval", desc: "Get the green light" },
    { title: "Published", desc: "Your event is live!" }
  ];

  const whoCanApply = [
    "Universities", "Student Organizations", "NGOs", "Communities", 
    "Companies", "Hospitals", "Government Institutions"
  ];

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-slate-50 relative pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <Link 
            href="/events"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Partner With Us</h1>
          <div className="w-10 h-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-md mx-auto w-full md:max-w-2xl lg:max-w-4xl px-4 py-6 space-y-12">
        
        {/* 1. Hero Section */}
        <motion.section 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-center pt-6 pb-2"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Handshake className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            Partner With <br/>YukCerita Events
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm md:text-base px-2">
            Universities, communities, NGOs, companies, hospitals, and other organizations can publish their events through YukCerita to reach a wider audience and create a bigger impact.
          </p>
        </motion.section>

        {/* 2. Why Partner With Us */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Why Partner With Us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex gap-4 items-start">
                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 shrink-0">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{benefit.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 3. How It Works */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">How It Works</h3>
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0 md:group-odd:text-right md:group-even:text-left">
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 4. Who Can Apply */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Who Can Apply</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {whoCanApply.map((item, idx) => (
              <span key={idx} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 shadow-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </motion.section>

        {/* 5. Final CTA */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
        >
          <div className="bg-blue-600 rounded-[24px] p-8 text-center text-white shadow-[0_8px_30px_rgba(37,99,235,0.25)] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <h3 className="text-2xl font-extrabold mb-3 relative z-10">Ready to Publish Your Event?</h3>
            <p className="text-blue-100 text-sm mb-8 relative z-10 px-4">
              Contact our team and we'll help publish your event on YukCerita.
            </p>
            
            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg relative z-10"
            >
              Submit Your Event
            </a>
          </div>
        </motion.section>

      </div>
    </main>
  );
}
