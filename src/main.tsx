import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import AppRouter from "./router/router"

// Initialize theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light"
document.documentElement.setAttribute("data-theme", savedTheme)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
)
