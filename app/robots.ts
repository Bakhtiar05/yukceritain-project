import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/'], // Prevent indexing of admin and auth routes
    },
    sitemap: 'https://www.yukceritain.com/sitemap.xml',
  }
}
