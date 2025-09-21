"use client"

import Sidebar from "../portal/sidebar"
import TopNav from "../portal/top-nav"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

export default function Layout() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex h-full`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col h-full">
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-white dark:bg-[#0F0F12]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
