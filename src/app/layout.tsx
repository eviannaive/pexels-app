import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Nav } from '@/components/Nav'
import AuthProvider from "@/context/AuthProvider"
import { ModalContextProvider } from "@/context/ModalContext"
import { ModalWrapper } from "@/components/ModalWrapper";
import { NavData } from '../../types';

const isDev = process.env.NODE_DEV?? false;
const inter = Inter({ subsets: ['latin'] })
const navData : NavData[] = [
  {
    name: 'Photos',
    link: '/photos',
    icon: 'faCameraRetro'
  },
  {
    name: 'Dashboard',
    link: '/dashboard',
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
        {isDev && <script src="http://localhost:8097"></script>}
        <AuthProvider>
          <ModalContextProvider>
            <ModalWrapper/>
            <Nav list={navData}/>
            <main className="w-full min-h-screen pt-[var(--navHeight)] bg-fixed bg-[length:250%_250%] bg-gradient-to-br from-orange-400/15 via-violet-700/15 to-cyan-700/30 animate-[bgLinear_30s_infinite]">
              {children}
            </main>
          </ModalContextProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
