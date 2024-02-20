import { SearchContextProvider } from '@/context/searchContext'
import { ModalContextProvider } from "@/context/ModalContext"
import { ModalWrapper } from "@/components/ModalWrapper";

export default function PhotosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SearchContextProvider>
      <ModalContextProvider>
        <ModalWrapper/>
        {children}
      </ModalContextProvider>
    </SearchContextProvider>
  )
}