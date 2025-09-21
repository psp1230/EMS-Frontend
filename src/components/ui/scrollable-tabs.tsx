"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Context for managing tabs state
interface ScrollableTabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  scrollContainerRef: React.RefObject<HTMLDivElement>
  showLeftGradient: boolean
  showRightGradient: boolean
  scrollLeft: () => void
  scrollRight: () => void
  scrollToTab: (tabId: string) => void
  keepMounted: boolean
  needsScroll: boolean // 新增：是否需要滾動
}

const ScrollableTabsContext = React.createContext<ScrollableTabsContextValue | undefined>(undefined)

const useScrollableTabs = () => {
  const context = React.useContext(ScrollableTabsContext)
  if (!context) {
    throw new Error("useScrollableTabs must be used within a ScrollableTabs")
  }
  return context
}

// Main Tabs container
interface ScrollableTabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  keepMounted?: boolean
}

const ScrollableTabs = React.forwardRef<HTMLDivElement, ScrollableTabsProps>(
  ({ defaultValue, value, onValueChange, children, className, keepMounted = false, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [showLeftGradient, setShowLeftGradient] = React.useState(false)
    const [showRightGradient, setShowRightGradient] = React.useState(false)
    const [needsScroll, setNeedsScroll] = React.useState(false) // 新增狀態
    const scrollContainerRef = React.useRef<HTMLDivElement>(null!)

    const activeTab = value !== undefined ? value : internalValue
    const setActiveTab = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [value, onValueChange],
    )

    const checkScrollability = React.useCallback(() => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        const needsScrolling = scrollWidth > clientWidth
        setNeedsScroll(needsScrolling)

        // 只有在需要滾動時才檢查漸變
        if (needsScrolling) {
          const { scrollLeft } = scrollContainerRef.current
          setShowLeftGradient(scrollLeft > 0)
          setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1)
        } else {
          setShowLeftGradient(false)
          setShowRightGradient(false)
        }
      }
    }, [])

    const scrollToTab = React.useCallback(
      (tabId: string) => {
        const tabElement = document.getElementById(`scrollable-tab-${tabId}`)
        if (tabElement && scrollContainerRef.current && needsScroll) {
          const containerRect = scrollContainerRef.current.getBoundingClientRect()
          const tabRect = tabElement.getBoundingClientRect()
          const scrollLeft = scrollContainerRef.current.scrollLeft

          const targetScrollLeft =
            scrollLeft + tabRect.left - containerRect.left - (containerRect.width - tabRect.width) / 2

          scrollContainerRef.current.scrollTo({
            left: Math.max(0, targetScrollLeft),
            behavior: "smooth",
          })
        }
      },
      [needsScroll],
    )

    const scrollLeft = React.useCallback(() => {
      if (scrollContainerRef.current && needsScroll) {
        scrollContainerRef.current.scrollBy({
          left: -200,
          behavior: "smooth",
        })
      }
    }, [needsScroll])

    const scrollRight = React.useCallback(() => {
      if (scrollContainerRef.current && needsScroll) {
        scrollContainerRef.current.scrollBy({
          left: 200,
          behavior: "smooth",
        })
      }
    }, [needsScroll])

    React.useEffect(() => {
      checkScrollability()
      const handleResize = () => checkScrollability()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [checkScrollability])

    // 監聽子元素變化，重新檢查是否需要滾動
    React.useEffect(() => {
      const observer = new MutationObserver(checkScrollability)
      if (scrollContainerRef.current) {
        observer.observe(scrollContainerRef.current, {
          childList: true,
          subtree: true,
        })
      }
      return () => observer.disconnect()
    }, [checkScrollability])

    const contextValue: ScrollableTabsContextValue = {
      activeTab,
      setActiveTab,
      scrollContainerRef,
      showLeftGradient,
      showRightGradient,
      scrollLeft,
      scrollRight,
      scrollToTab,
      keepMounted,
      needsScroll,
    }

    return (
      <ScrollableTabsContext.Provider value={contextValue}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </ScrollableTabsContext.Provider>
    )
  },
)
ScrollableTabs.displayName = "ScrollableTabs"

// Tabs List container
interface ScrollableTabsListProps {
  children: React.ReactNode
  className?: string
}

const ScrollableTabsList = React.forwardRef<HTMLDivElement, ScrollableTabsListProps>(
  ({ children, className, ...props }, ref) => {
    const { scrollContainerRef, showLeftGradient, showRightGradient, scrollLeft, scrollRight, needsScroll } =
      useScrollableTabs()

    const checkGradients = React.useCallback(() => {
      if (scrollContainerRef.current && needsScroll) {
        // const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        // 這裡的邏輯已經在父組件中處理了
      }
    }, [scrollContainerRef, needsScroll])

    return (
      <div ref={ref} className={cn("flex items-center", needsScroll ? "gap-2" : "", className)} {...props}>
        {/* 左滾動按鈕 - 只在需要滾動時顯示 */}
        {needsScroll && (
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 h-8 w-8 rounded-full"
            onClick={scrollLeft}
            disabled={!showLeftGradient}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">向左滾動</span>
          </Button>
        )}

        {/* 滾動區域容器 */}
        <div className="relative flex-1 overflow-hidden">
          {/* 左側漸變遮罩 - 只在需要滾動且有左側內容時顯示 */}
          {needsScroll && showLeftGradient && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          )}

          {/* 右側漸變遮罩 - 只在需要滾動且有右側內容時顯示 */}
          {needsScroll && showRightGradient && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          )}

          {/* 滾動容器 */}
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex border-b border-border",
              needsScroll ? "overflow-x-auto scrollbar-hide" : "overflow-x-visible",
            )}
            onScroll={checkGradients}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {children}
          </div>
        </div>

        {/* 右滾動按鈕 - 只在需要滾動時顯示 */}
        {needsScroll && (
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 h-8 w-8 rounded-full"
            onClick={scrollRight}
            disabled={!showRightGradient}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">向右滾動</span>
          </Button>
        )}
      </div>
    )
  },
)
ScrollableTabsList.displayName = "ScrollableTabsList"

// Individual tab trigger
interface ScrollableTabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const ScrollableTabsTrigger = React.forwardRef<HTMLButtonElement, ScrollableTabsTriggerProps>(
  ({ value, children, className, disabled, ...props }, ref) => {
    const { activeTab, setActiveTab, scrollToTab } = useScrollableTabs()

    const handleClick = () => {
      if (!disabled) {
        setActiveTab(value)
        scrollToTab(value)
      }
    }

    return (
      <button
        ref={ref}
        id={`scrollable-tab-${value}`}
        onClick={handleClick}
        disabled={disabled}
        type="button"
        className={cn(
          "flex-shrink-0 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          activeTab === value
            ? "text-primary border-primary"
            : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
ScrollableTabsTrigger.displayName = "ScrollableTabsTrigger"

// Tab content
interface ScrollableTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const ScrollableTabsContent = React.forwardRef<HTMLDivElement, ScrollableTabsContentProps>(
  ({ value, children, className, ...props }, ref) => {
    const { activeTab, keepMounted } = useScrollableTabs()

    if (keepMounted) {
      return (
        <div
          ref={ref}
          className={cn("mt-6", activeTab === value ? "block animate-in fade-in-50 duration-200" : "hidden", className)}
          {...props}
        >
          {children}
        </div>
      )
    } else {
      if (activeTab !== value) {
        return null
      }

      return (
        <div ref={ref} className={cn("my-4 animate-in fade-in-50 duration-200", className)} {...props}>
          {children}
        </div>
      )
    }
  },
)
ScrollableTabsContent.displayName = "ScrollableTabsContent"

export { ScrollableTabs, ScrollableTabsList, ScrollableTabsTrigger, ScrollableTabsContent, useScrollableTabs }
