import { useRef } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { queryOptions } from '../queries'
import { Hydrate } from 'react-query/hydration'
import './index.scss'

const App = ({ Component, pageProps }) => {
  const queryClientRef = useRef()
  if (!queryClientRef.current)
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: queryOptions,
      },
    })

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx)
  return { pageProps }
}

export default App
