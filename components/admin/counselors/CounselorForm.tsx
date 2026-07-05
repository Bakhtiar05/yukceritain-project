'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { counselorSchema, CounselorFormData } from '@/lib/schemas/counselors'
import { createCounselor, updateCounselor } from '@/lib/actions/counselors'
import type { Counselor } from '@/lib/types'

interface CounselorFormProps {
  counselor?: Counselor
}

export default function CounselorForm({ counselor }: CounselorFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(counselor?.photo_url || null)

  const isEditing = !!counselor

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CounselorFormData>({
    resolver: zodResolver(counselorSchema),
    defaultValues: counselor ? {
      full_name: counselor.full_name,
      title: counselor.title || "",
      profession: counselor.profession,
      photo_url: counselor.photo_url || "",
      gender: counselor.gender as any || undefined,
      specialization: counselor.specialization,
      short_bio: counselor.short_bio,
      full_bio: counselor.full_bio || "",
      education: counselor.education || "",
      experience_years: counselor.experience_years,
      languages: counselor.languages.join(", "),
      rating: counselor.rating,
      total_reviews: counselor.total_reviews,
      is_active: counselor.is_active,
      is_public: counselor.is_public,
      display_order: counselor.display_order,
    } : {
      full_name: "",
      title: "",
      profession: "",
      photo_url: "",
      gender: undefined,
      specialization: "",
      short_bio: "",
      full_bio: "",
      education: "",
      experience_years: 0,
      languages: "Indonesia",
      rating: 5,
      total_reviews: 0,
      is_active: true,
      is_public: true,
      display_order: 0,
    }
  })

  const onSubmit = async (data: CounselorFormData) => {
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('full_name', data.full_name)
    if (counselor?.slug) formData.append('slug', counselor.slug) // keep original slug if editing
    if (data.title) formData.append('title', data.title)
    formData.append('profession', data.profession)
    if (data.photo_url) formData.append('photo_url', data.photo_url)
    if (data.photo_file && data.photo_file.length > 0) formData.append('photo_file', data.photo_file[0])
    if (data.gender) formData.append('gender', data.gender)
    formData.append('specialization', data.specialization)
    formData.append('short_bio', data.short_bio)
    if (data.full_bio) formData.append('full_bio', data.full_bio)
    if (data.education) formData.append('education', data.education)
    formData.append('experience_years', String(data.experience_years))
    
    // Convert comma-separated string to an array for DB
    const langArray = data.languages.split(',').map((s: string) => s.trim()).filter(Boolean)
    formData.append('languages', langArray.join(','))
    
    formData.append('rating', String(data.rating))
    formData.append('total_reviews', String(data.total_reviews))
    formData.append('display_order', String(data.display_order))
    formData.append('is_active', data.is_active ? 'true' : 'false')
    formData.append('is_public', data.is_public ? 'true' : 'false')

    try {
      const result = isEditing 
        ? await updateCounselor(counselor.id, formData)
        : await createCounselor(formData)

      if (!result.success) {
        setError(result.error || 'Failed to save counselor')
        setIsSubmitting(false)
        return
      }

      router.push('/admin/konseling/counselors')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/konseling/counselors"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Counselor' : 'Add New Counselor'}
          </h1>
          <p className="text-slate-500">
            {isEditing ? 'Update counselor information and settings.' : 'Create a new counselor profile for the platform.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  {...register('full_name')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. Rani Kusuma"
                />
                {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Academic Title</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. M.Psi., Psikolog"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Profession</label>
                <input
                  {...register('profession')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. Psikolog Klinis"
                />
                {errors.profession && <p className="text-red-500 text-xs">{errors.profession.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Specialization</label>
                <input
                  {...register('specialization')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. Gangguan Kecemasan, Depresi"
                />
                {errors.specialization && <p className="text-red-500 text-xs">{errors.specialization.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
              </div>
              
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Photo</label>
                <div className="flex items-start gap-6">
                  {photoPreview && (
                    <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        {...register('photo_file')}
                        onChange={(e) => {
                          register('photo_file').onChange(e)
                          const file = e.target.files?.[0]
                          if (file) setPhotoPreview(URL.createObjectURL(file))
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-1">Maksimal ukuran 5 MB. Format: JPG, PNG, WEBP.</p>
                      {errors.photo_file && <p className="text-red-500 text-xs mt-1">{errors.photo_file.message?.toString()}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="text-xs text-slate-400 font-medium uppercase">ATAU GUNAKAN URL</span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <div>
                      <input
                        {...register('photo_url')}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                        placeholder="https://example.com/photo.jpg"
                        onChange={(e) => {
                          register('photo_url').onChange(e)
                          if (e.target.value) setPhotoPreview(e.target.value)
                        }}
                      />
                      {errors.photo_url && <p className="text-red-500 text-xs mt-1">{errors.photo_url.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biography & Education */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Biography & Education</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Short Bio (max 200 chars)</label>
                <textarea
                  {...register('short_bio')}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="Brief summary for counselor cards..."
                />
                {errors.short_bio && <p className="text-red-500 text-xs">{errors.short_bio.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Biography</label>
                <textarea
                  {...register('full_bio')}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="Detailed biography for the profile page..."
                />
                {errors.full_bio && <p className="text-red-500 text-xs">{errors.full_bio.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Education</label>
                <textarea
                  {...register('education')}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. S1 Psikologi Universitas X, S2 Profesi Klinis Universitas Y"
                />
                {errors.education && <p className="text-red-500 text-xs">{errors.education.message}</p>}
              </div>
            </div>
          </div>

          {/* Details & Settings */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Details & Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Experience (Years)</label>
                <input
                  type="number"
                  {...register('experience_years')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                />
                {errors.experience_years && <p className="text-red-500 text-xs">{errors.experience_years.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Languages (comma separated)</label>
                <input
                  {...register('languages')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="Indonesia, English"
                />
                {errors.languages && <p className="text-red-500 text-xs">{errors.languages.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('rating')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                />
                {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Total Reviews</label>
                <input
                  type="number"
                  {...register('total_reviews')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                />
                {errors.total_reviews && <p className="text-red-500 text-xs">{errors.total_reviews.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Display Order (lowest first)</label>
                <input
                  type="number"
                  {...register('display_order')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                />
                {errors.display_order && <p className="text-red-500 text-xs">{errors.display_order.message}</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_public')}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <div>
                  <span className="block text-sm font-medium text-slate-900">Make Public</span>
                  <span className="block text-xs text-slate-500">Visible on landing page and directory</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <div>
                  <span className="block text-sm font-medium text-slate-900">Active Status</span>
                  <span className="block text-xs text-slate-500">Can accept new bookings</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href="/admin/konseling/counselors"
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Counselor'}
          </button>
        </div>
      </form>
    </div>
  )
}
