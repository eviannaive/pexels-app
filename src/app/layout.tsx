import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Nav } from '@/components/Nav'

const inter = Inter({ subsets: ['latin'] })
const navData = [
  {
    name: 'PHOTOS',
    link: '/photos',
    icon: 'faCameraRetro'
  },
  {
    name: 'LOG IN',
    link: '/',
    icon: 'faRightToBracket'
  },
  {
    name: 'SIGN UP',
    link: '/',
    icon: 'faUserPlus'
  },
  {
    name: 'COLLECTION',
    link: '/',
    icon: 'faImages'
  },
]
export const metadata: Metadata = {
  title: 'My Pexels Collection',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav list={navData}/>
        <main className="w-full min-h-screen pt-[68px] bg-fixed bg-[length:250%_250%] bg-gradient-to-br from-orange-400/15 via-violet-700/15 to-cyan-700/30 animate-[bgLinear_30s_infinite]">
          {children}
        </main>
      </body>
    </html>
  )
}
