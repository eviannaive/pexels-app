import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"
import AuthProvider from "@/context/AuthProvider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(options)
  console.log(session)
  if(!session){
    console.log('23213123127648732684',session)
    redirect('login')
  }
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}