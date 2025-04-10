import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import * as Sentry from "@sentry/react"
import "./index.css"
import App from "./App.tsx"

Sentry.init({
  debug: true,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllInputs: false,
      maskAllText: false,
      blockAllMedia: false,
      networkDetailAllowUrls: [
        window.location.origin,
        import.meta.env.VITE_API_ENDPOINT,
      ],
      _experiments: {
        traceInternals: true,
        captureExceptions: true,
      },
    }),
    Sentry.replayCanvasIntegration(),
  ],
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
