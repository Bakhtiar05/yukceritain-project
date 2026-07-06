import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'
import { Card } from '@/components/ui/card'
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Heart,
  Lock,
  Mail,
  Shield,
  TrendingUp,
  Users,
  UserCheck,
  CalendarCheck,
  DollarSign
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About Us',
  description: 'Learn more about YukCeritain and our mission to make mental health support accessible for everyone.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white relative overflow-hidden">
        {/* Global Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Blue radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-70" />
          {/* Thin grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60" />
          {/* Blurred blue blobs */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-[100px]" />
        </div>

        {/* 1. Hero Section */}
        <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <ScrollReveal>
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-sm font-medium text-blue-600 mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              About Yukceritain
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl mb-6 font-playfair leading-tight">
              Helping People Feel Heard, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Supported</span>, and Understood.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
              "We believe that everyone deserves access to a safe space where they can share their thoughts, seek guidance, and grow toward better mental well-being."
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/konsultasi" className="btn btn-primary btn-large">
              Mulai Konseling
            </Link>
            <Link href="#vision-mission" className="btn btn-outline btn-large">
              Learn Our Mission
            </Link>
          </ScrollReveal>
        </section>

        {/* 2. Our Story */}
        <section className="relative z-10 py-20 bg-slate-50/50 backdrop-blur-sm border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal variant="fade-in">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl group flex items-center justify-center">
                  <Image
                    src="/assets/logo-v5.png"
                    alt="YukCeritain Logo"
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Glass reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/40 pointer-events-none" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-playfair">Our Story</h2>
                <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                  <p>
                    YukCeritain was born out of a simple observation: taking the first step to seek mental health support is often the hardest. Many people struggle in silence because of stigma, cost, or simply not knowing where to start.
                  </p>
                  <p>
                    We set out to change that by building a platform that breaks down these barriers. By combining modern technology with compassionate care, we created a space that feels welcoming, private, and deeply human.
                  </p>
                  <p>
                    Today, YukCeritain is more than just a counseling platform. It's a growing community of individuals and professionals working together to make mental well-being accessible, affordable, and comfortable for everyone.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 3. Vision & Mission */}
        <section id="vision-mission" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card className="p-10 h-full rounded-[2rem] border-slate-200/60 shadow-lg shadow-blue-900/5 bg-white/60 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-blue-100/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-playfair">Vision</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  To become the most trusted and inclusive digital mental health ecosystem, empowering every individual to achieve their full psychological potential through accessible and compassionate care.
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="p-10 h-full rounded-[2rem] border-slate-200/60 shadow-lg shadow-blue-900/5 bg-white/60 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-blue-100/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-playfair">Mission</h3>
                <ul className="space-y-4">
                  {[
                    "Provide affordable and professional online counseling.",
                    "Build a safe, stigma-free community for sharing.",
                    "Deliver high-quality mental health education.",
                    "Continuously innovate for a better user experience."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-blue-500 mr-3 shrink-0" />
                      <span className="text-slate-600 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* 4. Core Values */}
        <section className="relative z-10 py-20 bg-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 font-playfair">Our Values</h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Heart, title: 'Empathy', desc: 'Understanding and sharing the feelings of others without judgment.' },
                { icon: Shield, title: 'Trust', desc: 'Maintaining strict confidentiality and professionalism at all times.' },
                { icon: TrendingUp, title: 'Growth', desc: 'Fostering personal development and continuous learning.' },
                { icon: Users, title: 'Accessibility', desc: 'Making quality mental health care available for everyone.' },
              ].map((val, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <Card className="p-8 text-center rounded-3xl border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 bg-white">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 text-blue-600">
                      <val.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                    <p className="text-slate-500">{val.desc}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Leadership Team */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-playfair">Meet Our Leadership</h2>
              <p className="text-lg text-slate-500">The passionate people behind YukCeritain.</p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: 'CEO', name: 'Bakhtiar Kamil', desc: 'Responsible for vision, partnerships, and organizational growth.', image: '/assets/aboutme.png' },
              { role: 'CTO', name: 'Jane Doe', desc: 'Responsible for technology, platform development, and security.', image: 'https://i.pravatar.cc/300?u=cto' },
              { role: 'CMO', name: 'John Smith', desc: 'Responsible for branding, marketing strategy, and community engagement.', image: 'https://i.pravatar.cc/300?u=cmo' },
            ].map((leader, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <Card className="p-8 text-center rounded-[24px] border-slate-200/60 shadow-lg shadow-slate-200/20 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white">
                  <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-sm mx-auto mb-6 overflow-hidden relative">
                    <Image src={leader.image} alt={leader.name} fill className="object-cover" sizes="(max-width: 128px) 100vw, 128px" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{leader.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{leader.role}</p>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">{leader.desc}</p>

                  <div className="flex justify-center gap-4 mb-8">
                    <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Mail className="w-5 h-5" /></a>
                  </div>

                  <Link href="#" className="btn btn-outline w-full text-center flex justify-center">
                    View Profile
                  </Link>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 6. Why People Trust Us */}
        <section className="relative z-10 py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-playfair">Why People Trust Us</h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: 'Private & Confidential', desc: 'Your data and sessions are secured with end-to-end encryption.' },
                { icon: UserCheck, title: 'Professional Counselors', desc: 'Licensed and experienced psychologists ready to help.' },
                { icon: DollarSign, title: 'Affordable Services', desc: 'Quality mental healthcare that fits your budget.' },
                { icon: Heart, title: 'Safe Community', desc: 'A moderated, supportive space for sharing experiences.' },
                { icon: BookOpen, title: 'Educational Resources', desc: 'Access to articles, webinars, and mental health tools.' },
                { icon: CalendarCheck, title: 'Easy Booking Process', desc: 'Seamless scheduling for online or offline sessions.' },
              ].map((feature, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="flex gap-4 p-6 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Our Journey (Timeline) */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-playfair">Our Journey</h2>
          </ScrollReveal>

          <div className="relative max-w-5xl mx-auto">
            {/* Horizontal Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative">
              {[
                { year: '2022', title: 'YukCeritain Founded' },
                { year: '2023', title: 'Community Launch' },
                { year: '2024', title: 'Online Counseling' },
                { year: '2025', title: 'Educational Events' },
                { year: 'Future', title: 'Global Expansion' },
              ].map((milestone, i) => (
                <ScrollReveal key={i} delay={i * 0.1} className="relative flex flex-col items-center text-center group">
                  {/* Vertical Line for Mobile */}
                  {i !== 0 && <div className="md:hidden w-0.5 h-8 bg-blue-100 mb-4" />}

                  {/* Dot */}
                  <div className="w-6 h-6 rounded-full bg-white border-4 border-blue-200 z-10 mb-4 group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300" />

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 w-full">
                    <span className="text-blue-600 font-bold text-sm mb-1 block">{milestone.year}</span>
                    <h3 className="text-slate-800 font-medium text-sm">{milestone.title}</h3>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Community Impact */}
        <section className="relative z-10 py-20 bg-blue-600 text-white overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
              {[
                { num: '1,800+', label: 'Community Members' },
                { num: '300+', label: 'Counseling Sessions' },
                { num: '50+', label: 'Educational Events' },
                { num: '95%', label: 'Positive Feedback' },
              ].map((stat, i) => (
                <ScrollReveal key={i} delay={i * 0.1} className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 font-playfair">{stat.num}</div>
                  <div className="text-blue-100 text-sm md:text-base font-medium">{stat.label}</div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Call To Action */}
        <section className="relative z-10 py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-12 md:p-20 text-center shadow-2xl shadow-blue-900/5">
              {/* Floating elements background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300/10 rounded-full blur-[80px]" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-playfair leading-tight">
                  Ready to Begin Your Journey?
                </h2>
                <p className="text-lg md:text-xl text-slate-500 mb-10">
                  "We're here to support you every step of the way."
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
                  <Link href="/konsultasi" className="btn btn-primary btn-large">
                    Mulai Konseling
                  </Link>
                  <Link href="/community" className="btn btn-outline btn-large">
                    Explore Community
                  </Link>
                  <Link href="/event" className="btn btn-outline btn-large">
                    Explore Events
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
