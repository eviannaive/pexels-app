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
  console.log(session,'dfjksdljfklsdjfklsdjkflkfjl')
  if(!session){
    redirect('login')
  }
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}