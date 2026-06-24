import Image from 'next/image'

interface ArticleCoverProps {
  src: string | null
  alt: string
  caption?: string
}

export default function ArticleCover({ src, alt, caption }: ArticleCoverProps) {
  if (!src) return null

  return (
    <figure className="max-w-[860px] mx-auto px-6 py-8">
      <div className="relative h-[280px] md:h-[380px] lg:h-[420px] rounded-xl overflow-hidden shadow-lg">
        <Image src={src} alt={alt} fill className="object-cover" priority />
      </div>
      {caption && (
        <figcaption className="text-center text-sm italic text-neutral-500 mt-4 bg-neutral-50 py-2 px-4 rounded-md mx-auto max-w-xl">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
