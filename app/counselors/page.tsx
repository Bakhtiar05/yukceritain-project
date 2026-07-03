import { getPublicCounselors } from '@/lib/actions/counselors'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Star } from 'lucide-react'

export const metadata = {
  title: 'Counselors Directory | YukCeritaIN',
  description: 'Find the right mental health professional for your journey.',
}

interface CounselorsPageProps {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export default async function CounselorsPage({ searchParams }: CounselorsPageProps) {
  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page || '1')
  const search = resolvedParams.search || ''

  const { counselors, count } = await getPublicCounselors({
    search,
    page,
    limit: 12
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Counselors Directory</h1>
            <p className="text-lg text-slate-600">Find the right professional to support your mental health journey.</p>
          </div>

          <form className="mb-10 flex gap-4 max-w-2xl">
            <input 
              type="text" 
              name="search"
              defaultValue={search}
              placeholder="Search by name, specialization, or profession..."
              className="flex-1 px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
            />
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>

          {counselors.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 text-lg">No counselors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {counselors.map(counselor => (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
