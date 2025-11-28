import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

const fetchSecureData = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/secure`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: import.meta.env.VITE_API_AUTH_TOKEN,
    },
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json()
}

function App() {
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState("")

  const { refetch: refetchSecure } = useQuery({
    queryKey: ["secureData"],
    queryFn: fetchSecureData,
    enabled: false, // Don't run the query automatically

    onSuccess: (data) => {
      setStatus(data.status)
    },
    onError: (error: Error) => {
      console.error("Error fetching secure data:", error)
      setStatus("Error fetching secure data")
    },
  })

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <button
        onClick={() => {
          fetch(`${import.meta.env.VITE_API_ENDPOINT}/health`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(async (resp) => {
            const data = await resp.json()
            setStatus(data.status)
          })
        }}
      >
        Check health (unsecured)
      </button>
      <br />
      <button
        onClick={() => {
          fetch(`${import.meta.env.VITE_API_ENDPOINT}/secure`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: import.meta.env.VITE_API_AUTH_TOKEN,
            },
          }).then(async (resp) => {
            const data = await resp.json()
            setStatus(data.status)
          })
        }}
      >
        Check authorization (secured)
      </button>
      <p>Response: {status}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

function AppWithQueryClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

export default AppWithQueryClient
