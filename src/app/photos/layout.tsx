import { SearchContextProvider } from '@/context/searchContext'

export default function PhotosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SearchContextProvider>
      {children}
    </SearchContextProvider>
  )
}