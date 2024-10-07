
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return <DummyHomepage />
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-40 h-40 mb-4 animate-pulse">
        <Image
          src="/logo.svg"
          alt="Circadia Logo"
          width={160}
          height={160}
          priority
          className="animate-bounce"
        />
      </div>
      <h1 className="text-3xl font-bold text-[#7B2CBF]">Circadia</h1>
    </div>
  )
}

function DummyHomepage() {
  return (
    <div className="min-h-screen bg-white text-[#1A2B4C] p-4">
      <header className="bg-[#7B2CBF] text-white p-4 rounded-lg mb-4">
        <h1 className="text-2xl font-bold">Circadia</h1>
      </header>
      <main>
        <section className="bg-[#E2CFEA] rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Welcome to Circadia</h2>
          <p>Your journey to better sleep and health starts here.</p>
        </section>
        <section className="bg-[#E2CFEA] rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Sleep Score</h2>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-[#3A86FF] text-white flex items-center justify-center text-2xl font-bold">
              85
            </div>
            <p className="ml-4">Great sleep last night!</p>
          </div>
        </section>
        <section className="bg-[#E2CFEA] rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Daily Activity</h2>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center text-2xl font-bold">
              7k
            </div>
            <p className="ml-4">steps today</p>
          </div>
        </section>
      </main>
      <footer className="mt-8 text-center text-sm text-[#7B2CBF]">
        <p>© 2024 Circadia. All rights reserved.</p>
      </footer>
    </div>
  )
}