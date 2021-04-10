import { MutationObserverProvider } from '../contexts/mutationObserver'
import './index.scss'

const App = ({ Component, pageProps }) => (
  <MutationObserverProvider>
    <Component {...pageProps} />
  </MutationObserverProvider>
)

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx)
  return { pageProps }
}

export default App
