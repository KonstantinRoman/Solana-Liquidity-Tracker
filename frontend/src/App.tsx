import { Provider } from "@/components/ui/provider"; // Chakra UI v3
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PoolDetailPage } from './pages/PoolDetailPage'
import { PoolsPage } from './pages/PoolPage'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PoolsPage />} />
            <Route path="/pool/:address" element={<PoolDetailPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  )
}