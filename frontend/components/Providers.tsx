'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } }
  }))

  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: '"Palatino Linotype", Palatino, serif',
            borderRadius: '10px',
            border: '1px solid #E4E1D8',
            boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
          },
          success: { iconTheme: { primary: '#C9A020', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  )
}
