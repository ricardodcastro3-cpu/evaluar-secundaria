import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="app-shell-decor pointer-events-none fixed inset-0 z-0"
        aria-hidden
      />
      <div className="relative z-10">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="relative flex-1 min-w-0">
            <div
              key={location.pathname}
              className="page-enter max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8"
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
