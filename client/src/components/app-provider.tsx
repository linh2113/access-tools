'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         retry: 0
      }
   }
})

export default function AppProvider({ children }: { children: React.ReactNode }) {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
