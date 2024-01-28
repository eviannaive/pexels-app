import { AuthProvider } from "@/components/AuthProvider"

export default function SignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}