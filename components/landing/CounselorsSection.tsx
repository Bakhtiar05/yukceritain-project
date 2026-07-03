import Link from 'next/link'
import { getFeaturedCounselors } from '@/lib/actions/counselors'
import { Star } from 'lucide-react'

export default async function CounselorsSection() {
  const counselors = await getFeaturedCounselors(4)

  if (counselors.length === 0) return null

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Meet Our Counselors
          </h2>
          <p className="text-lg text-slate-600">
            Our experienced mental health professionals are ready to support your journey with empathy, professionalism, and evidence-based care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counselors.map((counselor) => (
            <div key={counselor.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <img 
                  src={counselor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.full_name)}&background=random`} 
                  alt={counselor.full_name}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {counselor.full_name}
                </h3>
                {counselor.title && (
                  <p className="text-sm font-medium text-blue-600 mt-1">{counselor.title}</p>
                )}
                <p className="text-slate-500 text-sm mt-1">{counselor.profession}</p>
              </div>

              <div className="flex justify-center items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-slate-700">{counselor.rating}</span>
                <span className="text-slate-400 text-sm">({counselor.total_reviews} reviews)</span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 mb-6 text-center">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Experience</p>
                <p className="font-semibold text-slate-900">{counselor.experience_years} Years</p>
              </div>

              <p className="text-slate-600 text-sm text-center mb-6 line-clamp-2">
                {counselor.short_bio}
              </p>

              <div className="flex flex-col gap-2">
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
