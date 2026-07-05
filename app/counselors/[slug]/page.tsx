import { getCounselorBySlug } from '@/lib/actions/counselors'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import { Star, GraduationCap, Clock, MessageCircle, HeartPulse, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ProfilePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const counselor = await getCounselorBySlug(resolvedParams.slug)
  if (!counselor) return { title: 'Not Found' }

  return {
    title: `${counselor.full_name} - ${counselor.profession} | YukCeritaIN`,
    description: counselor.short_bio
  }
}

export default async function CounselorProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const counselor = await getCounselorBySlug(resolvedParams.slug)

  if (!counselor) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-28 md:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-8 items-start relative -mt-16">
                
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative">
                  <img 
                    src={counselor.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.full_name)}&background=random&size=200`} 
                    alt={counselor.full_name}
                    className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-md bg-white"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white" title="Active"></div>
                </div>

                <div className="flex-1 pt-2 md:pt-20">
                  <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                    {counselor.full_name}
                  </h1>
                  {counselor.title && (
                    <p className="text-lg font-medium text-blue-600 mt-1">{counselor.title}</p>
                  )}
                  <p className="text-slate-500 text-lg mt-1">{counselor.profession}</p>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg text-amber-700 font-medium">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      {counselor.rating} <span className="text-amber-600/70 font-normal">({counselor.total_reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 font-medium">
                      <Clock className="w-5 h-5 text-slate-400" />
                      {counselor.experience_years} Years Experience
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto pt-2 md:pt-20 md:self-stretch md:flex md:flex-col md:justify-end">
                  <Link 
                    href={`/konsultasi?counselor=${counselor.id}`}
                    className="block w-full text-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                  >
                    Book Consultation
                  </Link>
                </div>

              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* About */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  About {counselor.full_name.split(' ')[0]}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600">
                  <p className="whitespace-pre-wrap">{counselor.full_bio || counselor.short_bio}</p>
                </div>
              </div>

              {/* Education */}
              {counselor.education && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Education & Credentials
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600">
                    <p className="whitespace-pre-wrap">{counselor.education}</p>
                  </div>
                </div>
              )}

            </div>

            <div className="space-y-8">
              
              {/* Specialization */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-red-500" />
                  Specializations
                </h3>
                <ul className="space-y-3">
                  {counselor.specialization.split(',').map((spec, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{spec.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {counselor.languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
