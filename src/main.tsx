import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./globals.css"
import App from "./App.tsx"
import { exchangeOAuthCodeFromUrl } from "@/lib/auth/pkce"

/**
 * PKCE **antes** de montar React: evita que cualquier efecto / ruta llame a
 * getSession() sin sesión mientras el `code` sigue en la URL.
 */
async function bootstrap() {
  await exchangeOAuthCodeFromUrl()
}

void bootstrap()
  .catch((err) => console.error("[auth] bootstrap PKCE:", err))
  .finally(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
