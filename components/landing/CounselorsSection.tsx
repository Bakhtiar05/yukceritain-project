import Link from 'next/link'
import { getFeaturedCounselors } from '@/lib/actions/counselors'
import { Star, MoveRight } from 'lucide-react'

export default async function CounselorsSection() {
  const counselors = await getFeaturedCounselors(4)

  if (counselors.length === 0) return null

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Meet Our Counselors
          </h2>
          <p className="text-lg text-slate-600 mb-6 md:mb-0">
            Our experienced mental health professionals are ready to support your journey with empathy, professionalism, and evidence-based care.
          </p>
          <div className="flex md:hidden items-center justify-center gap-2 text-slate-400 text-sm font-medium mt-4 animate-pulse">
            <span>Swipe untuk melihat profil lain</span>
            <MoveRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {counselors.map((counselor) => (
            <div key={counselor.id} className="w-[75vw] max-w-[260px] shrink-0 snap-center md:w-auto bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 md:mb-6">
                <img 
                  src={counselor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.full_name)}&background=random`} 
                  alt={counselor.full_name}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                  {counselor.full_name}
                </h3>
                {counselor.title && (
                  <p className="text-xs md:text-sm font-medium text-blue-600 mt-1">{counselor.title}</p>
                )}
                <p className="text-slate-500 text-xs md:text-sm mt-1">{counselor.profession}</p>
              </div>

              <div className="flex justify-center items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-slate-700">{counselor.rating}</span>
                <span className="text-slate-400 text-sm">({counselor.total_reviews} reviews)</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 mb-6 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Experience</p>
                <p className="font-semibold text-slate-900 text-sm md:text-base">{counselor.experience_years} Years</p>
              </div>

              <p className="text-slate-600 text-sm text-center mb-6 line-clamp-2">
                {counselor.short_bio}
              </p>

              <div className="flex flex-col gap-2 mt-4 md:mt-0">
                <Link 
                  href={`/konsultasi?counselor=${counselor.id}`}
                  className="block w-full py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  Book Consultation
                </Link>
                <Link 
                  href={`/counselors/${counselor.slug}`}
                  className="block w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/counselors"
            className="inline-block px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 rounded-2xl font-semibold transition-colors shadow-sm"
          >
            View All Counselors
          </Link>
        </div>
      </div>
    </section>
  )
}
