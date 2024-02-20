import { SearchContextProvider } from '@/context/searchContext'
import { ModalContextProvider } from "@/context/ModalContext"
import { ModalWrapper } from "@/components/ModalWrapper";
import { Enlarge } from '@/components/Enlarge';

export default function PhotosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SearchContextProvider>
      <ModalContextProvider>
        <ModalWrapper/>
        <Enlarge/>
        {children}
      </ModalContextProvider>
    </SearchContextProvider>
  )
}