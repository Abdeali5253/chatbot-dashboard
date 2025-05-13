import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import theme from './theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, 
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
      staleTime: 1000 * 60 * 5, 
      cacheTime: 1000 * 60 * 30,  
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      keepPreviousData: true, 
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
)
