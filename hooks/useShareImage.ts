import { useState, useCallback, RefObject } from 'react'
import { toPng, toBlob } from 'html-to-image'

export function useShareImage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = useCallback(async (ref: RefObject<HTMLElement | null>) => {
    if (!ref.current) return null

    setIsGenerating(true)
    setError(null)

    try {
      // 1080x1920 is standard story size, we will style the card appropriately
      // pixelRatio 3 ensures high quality
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 3,
        backgroundColor: 'transparent',
        cacheBust: true,
        skipFonts: true, // Often fixes [object Event] caused by Google Fonts failing to load in foreignObject
        imagePlaceholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // Transparent 1x1 pixel fallback for broken images
      })
      return dataUrl
    } catch (err: any) {
      console.error('Error generating image:', err)
      setError(err.message || 'Failed to generate image')
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const shareImage = useCallback(async (
    dataUrl: string,
    title: string,
    text: string,
    url: string,
    fileName = 'story.png'
  ) => {
    try {
      // Convert dataUrl to blob
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], fileName, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text,
          url,
          files: [file]
        })
        return true
      }
      return false
    } catch (err) {
      console.error('Error sharing image:', err)
      return false
    }
  }, [])

  const downloadImage = useCallback((dataUrl: string, fileName = 'story.png') => {
    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.click()
  }, [])

  return { generateImage, shareImage, downloadImage, isGenerating, error }
}
