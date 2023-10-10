import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <script defer data-domain="tip.dev" src="https://plausible-analytics-production-d712.up.railway.app/js/script.js"></script>
      <Component {...pageProps} />
    </>
  )
}
