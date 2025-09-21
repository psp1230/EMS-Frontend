"use client"

import { Button } from "./button"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { format, parseISO, isValid, parse } from "date-fns"
import * as React from "react"
import { getLocaleObject } from "@/utils/commonFunctions"
import { CalendarIcon } from "lucide-react"

interface DatePickerProps {
  value?: Date | string
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  locale?: string // e.g. 'en-US', 'zh-TW'
  disabled?: boolean
}

const DatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  locale = "en-US",
  className,
  disabled = false,
}: DatePickerProps) => {
  const localeObj = getLocaleObject(locale)
  const [inputValue, setInputValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const parsedDate = React.useMemo(() => {
    if (value instanceof Date) return isValid(value) ? value : undefined
    if (typeof value === "string") {
      const date = parseISO(value)
      return isValid(date) ? date : undefined
    }
    return undefined
  }, [value])

  React.useEffect(() => {
    if (parsedDate) {
      setInputValue(format(parsedDate, "yyyy/MM/dd"))
    } else {
      setInputValue("")
    }
  }, [parsedDate])

  const handleSelect = (selectedDate: Date | undefined) => {
    onChange?.(selectedDate)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Try to parse the input value
    if (newValue) {
      // Support multiple date formats
      const formats = ["yyyy/MM/dd", "yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy"]
      let parsedDate: Date | undefined

      for (const formatStr of formats) {
        try {
          const date = parse(newValue, formatStr, new Date())
          if (isValid(date)) {
            parsedDate = date
            break
          }
        } catch {
          // Continue to next format
        }
      }

      onChange?.(parsedDate)
    } else {
      onChange?.(undefined)
    }
  }

  const handleInputBlur = () => {
    if (parsedDate) {
      setInputValue(format(parsedDate, "yyyy/MM/dd"))
    }
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10"
      />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 h-full px-3 py-2 hover:bg-transparent"
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={parsedDate} onSelect={handleSelect} locale={localeObj} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { DatePicker }
export default DatePicker
