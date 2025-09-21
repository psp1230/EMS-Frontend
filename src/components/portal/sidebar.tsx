"use client"

import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react"

import { Home } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import routes from "@/router"

export default function Sidebar() {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const availableRoutes = routes.find((route) => route.meta?.title === "主頁面框架")?.children || []

  function handleNavigation(path: string) {
    navigate(`/${path}`)
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    icon: Icon,
    children,
    href,
  }: {
    icon: any
    children: React.ReactNode
    href: string
  }) {
    return (
      <Button
        variant={"link"}
        onClick={() => handleNavigation(href)}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Button>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[20] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[20] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
          <a
            href="https://kokonutui.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://kokonutui.com/logo.svg"
                alt="Acme"
                width={32}
                height={32}
                className="flex-shrink-0 hidden dark:block"
              />
              <img
                src="https://kokonutui.com/logo-black.svg"
                alt="Acme"
                width={32}
                height={32}
                className="flex-shrink-0 block dark:hidden"
              />
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                EMS系統
              </span>
            </div>
          </a>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div className="space-y-1">
                {availableRoutes
                  .filter((route) => route.meta && route.meta.title)
                  .map((route) => (
                    <NavItem
                      key={route.path}
                      href={(route.path ?? "").replace(/^\//, "")} // 移除開頭的斜杠
                      icon={
                        route.path === "home"
                          ? Home
                          : route.path === "customer-info"
                            ? Users2
                            : route.path === "employee-info"
                              ? Users2
                              : route.path === "car-info"
                                ? CreditCard
                                : route.path === "carrier-info"
                                  ? Building2
                                  : Folder // 預設圖標
                      }
                    >
                      {route.meta?.title}
                    </NavItem>
                  ))}
              </div>
            </div>
          </div>

          {/* <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="#" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="#" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div> */}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[20] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
