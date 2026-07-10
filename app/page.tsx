import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import HeroSection from '@/components/landing/HeroSection'
import ServicesSection from '@/components/landing/ServicesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import CounselorsSection from '@/components/landing/CounselorsSection'
import FaqSection from '@/components/landing/FaqSection'
import BlogPreview from '@/components/landing/BlogPreview'
import CtaSection from '@/components/landing/CtaSection'
import { getLatestPosts } from '@/lib/actions/posts'

export default async function HomePage() {
  const posts = await getLatestPosts(3)

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorks />
        <CounselorsSection />
        <FaqSection />
        <BlogPreview posts={posts} />
        <CtaSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
