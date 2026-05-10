import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./globals.css"
import App from "./App.tsx"
import { exchangeOAuthCodeIfPresent, isSupabaseConfigured, supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"

async function bootstrapAuth() {
  await exchangeOAuthCodeIfPresent()
  const onAuthCallback =
    typeof window !== "undefined" && window.location.pathname === "/auth/callback"
  if (!onAuthCallback) {
    await useAuthStore.getState().checkSession()
  }

  if (isSupabaseConfigured() && supabase) {
    supabase.auth.onAuthStateChange((event) => {
      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT"
      ) {
        void useAuthStore.getState().checkSession()
      }
    })
  }
}

bootstrapAuth()
  .catch((err) => console.error("[auth] bootstrap failed:", err))
  .finally(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
