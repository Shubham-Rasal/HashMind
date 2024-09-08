import Image from 'next/image'
import Hero from '@/components/HeroSection'
import Features from '@/components/Features'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="dark:bg-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}