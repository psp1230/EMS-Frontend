/* eslint-disable max-lines */
"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import * as React from "react"
import { zhTW } from "date-fns/locale"

export interface DateRange {
  from: Date
  to: Date | undefined
}

interface Preset {
  name: string
  label: string
}

const PRESETS: Preset[] = [
  { name: "today", label: "今天" },
  { name: "yesterday", label: "昨天" },
  { name: "last7", label: "過去 7 天" },
  { name: "last14", label: "過去 14 天" },
  { name: "last30", label: "過去 30 天" },
  { name: "thisWeek", label: "本週" },
  { name: "lastWeek", label: "上週" },
  { name: "thisMonth", label: "本月" },
  { name: "lastMonth", label: "上個月" },
]

export interface DateRangePickerProps {
  onUpdate?: (values: { range: DateRange }) => void
  initialDateFrom?: Date | string
  initialDateTo?: Date | string
  align?: "start" | "center" | "end"
  locale?: string
  className?: string
}

const formatDate = (date: Date, locale = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    const parts = dateInput.split("-").map((part) => Number.parseInt(part, 10))
    return new Date(parts[0], parts[1] - 1, parts[2])
  }
  return dateInput
}

// 生成年份選項（當前年份前後10年）
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i)
  }
  return years
}

// 生成月份選項
const generateMonthOptions = () => {
  const months = []
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1)
    months.push({
      value: i,
      label: date.toLocaleDateString("zh-TW", { month: "long" }),
    })
  }
  return months
}

// 年份月份選擇器組件
const YearMonthSelector = ({
  currentDate,
  onDateChange,
}: {
  currentDate: Date
  onDateChange: (date: Date) => void
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedYear, setSelectedYear] = React.useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(currentDate.getMonth())

  const yearOptions = generateYearOptions()
  const monthOptions = generateMonthOptions()

  React.useEffect(() => {
    setSelectedYear(currentDate.getFullYear())
    setSelectedMonth(currentDate.getMonth())
  }, [currentDate])

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1)
    onDateChange(newDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedYear(currentDate.getFullYear())
    setSelectedMonth(currentDate.getMonth())
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-1 font-medium hover:bg-muted rounded-md">
          <div className="flex items-center gap-1">
            <span>{currentDate.toLocaleDateString("zh-TW", { year: "numeric", month: "long" })}</span>
            <ChevronDownIcon className="h-3 w-3" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="center">
        <div className="space-y-4">
          <h3 className="font-medium text-center">選擇年份和月份</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">年份</label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number.parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">月份</label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(Number.parseInt(value, 10))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              取消
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              確認
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// 自定義日曆組件
const CustomCalendar = ({
  date,
  selected,
  onSelect,
  onMonthChange,
  className,
}: {
  date: Date
  selected: DateRange
  onSelect: (range: DateRange | undefined) => void
  onMonthChange: (date: Date) => void
  className?: string
}) => {
  const [currentDate, setCurrentDate] = React.useState(date)

  React.useEffect(() => {
    setCurrentDate(date)
  }, [date])

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    setCurrentDate(prevMonth)
    onMonthChange(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    setCurrentDate(nextMonth)
    onMonthChange(nextMonth)
  }

  const handleYearMonthChange = (newDate: Date) => {
    setCurrentDate(newDate)
    onMonthChange(newDate)
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <Calendar
        locale={zhTW}
        mode="range"
        selected={selected}
        onSelect={onSelect as any}
        month={currentDate}
        onMonthChange={(newMonth) => {
          setCurrentDate(newMonth)
          onMonthChange(newMonth)
        }}
        className="border-none"
      />
    </div>
  )
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  onUpdate,
  align = "center",
  locale = "en-US",
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : getDateAdjustedForTimezone(initialDateFrom),
  })

  const openedRangeRef = React.useRef<DateRange>(range)
  const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>(undefined)
  const [calendarMonths, setCalendarMonths] = React.useState<[Date, Date]>([
    new Date(),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  ])

  const getPresetRange = React.useCallback((presetName: string): DateRange => {
    const now = new Date()
    const today = new Date(now.setHours(0, 0, 0, 0))
    const endToday = new Date(now.setHours(23, 59, 59, 999))

    switch (presetName) {
      case "today":
        return { from: today, to: endToday }
      case "yesterday": {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return {
          from: yesterday,
          to: new Date(yesterday.setHours(23, 59, 59, 999)),
        }
      }
      case "last7":
        return {
          from: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
          to: endToday,
        }
      case "last14":
        return {
          from: new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000),
          to: endToday,
        }
      case "last30":
        return {
          from: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
          to: endToday,
        }
      case "thisWeek": {
        const first = today.getDate() - today.getDay()
        return {
          from: new Date(today.getFullYear(), today.getMonth(), first),
          to: endToday,
        }
      }
      case "lastWeek": {
        const first = today.getDate() - today.getDay() - 7
        const last = first + 6
        return {
          from: new Date(today.getFullYear(), today.getMonth(), first),
          to: new Date(today.getFullYear(), today.getMonth(), last, 23, 59, 59, 999),
        }
      }
      case "thisMonth": {
        return {
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: endToday,
        }
      }
      case "lastMonth": {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        return {
          from: lastMonth,
          to: new Date(lastDayOfLastMonth.setHours(23, 59, 59, 999)),
        }
      }
      default:
        throw new Error(`Unknown date range preset: ${presetName}`)
    }
  }, [])

  const setPreset = (preset: string): void => {
    const newRange = getPresetRange(preset)
    setRange(newRange)
    setSelectedPreset(preset)
    if (newRange.from) {
      setCalendarMonths([
        new Date(newRange.from.getFullYear(), newRange.from.getMonth(), 1),
        new Date(newRange.from.getFullYear(), newRange.from.getMonth() + 1, 1),
      ])
    }
  }

  const checkPreset = React.useCallback(() => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name)
      if (presetRange.from.getTime() === range.from.getTime() && presetRange.to?.getTime() === range.to?.getTime()) {
        setSelectedPreset(preset.name)
        return
      }
    }
    setSelectedPreset(undefined)
  }, [range, getPresetRange])

  const resetValues = (): void => {
    setRange({
      from: getDateAdjustedForTimezone(initialDateFrom),
      to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : getDateAdjustedForTimezone(initialDateFrom),
    })
    setSelectedPreset(undefined)
    setCalendarMonths([new Date(), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)])
  }

  React.useEffect(() => {
    checkPreset()
  }, [checkPreset])

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string
    label: string
    isSelected: boolean
  }) => (
    <Button className={cn("justify-start", isSelected && "bg-muted")} variant="ghost" onClick={() => setPreset(preset)}>
      <CheckIcon className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
      {label}
    </Button>
  )

  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b
    return a.from.getTime() === b.from.getTime() && (!a.to || !b.to || a.to.getTime() === b.to.getTime())
  }

  React.useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range
    }
  }, [isOpen, range])

  // 處理第一個月曆的月份變更
  const handleFirstCalendarMonthChange = (month: Date) => {
    const newFirstMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const newSecondMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
    setCalendarMonths([newFirstMonth, newSecondMonth])
  }

  // 處理第二個月曆的月份變更
  const handleSecondCalendarMonthChange = (month: Date) => {
    const newSecondMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const newFirstMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1)
    setCalendarMonths([newFirstMonth, newSecondMonth])
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left text-[11px] font-normal text-wrap", className)}
        >
          {formatDate(range.from, locale)}
          {range.to && (
            <>
              <span className="text-xl">~</span>
              {formatDate(range.to, locale)}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align} sideOffset={4}>
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          {/* Calendar Section */}
          <div className="space-y-4">
            <div className="hidden lg:flex space-x-4">
              {/* 第一個月曆 */}
              <CustomCalendar
                date={calendarMonths[0]}
                selected={range}
                onSelect={(newRange) => {
                  if (newRange) {
                    setRange(newRange as DateRange)
                  }
                }}
                onMonthChange={handleFirstCalendarMonthChange}
              />
              {/* 第二個月曆 */}
              <CustomCalendar
                date={calendarMonths[1]}
                selected={range}
                onSelect={(newRange) => newRange && setRange(newRange as DateRange)}
                onMonthChange={handleSecondCalendarMonthChange}
              />
            </div>
            {/* Single calendar for mobile */}
            <div className="lg:hidden">
              <CustomCalendar
                date={calendarMonths[0]}
                selected={range}
                onSelect={(newRange) => newRange && setRange(newRange as DateRange)}
                onMonthChange={handleFirstCalendarMonthChange}
              />
            </div>
          </div>
          {/* Presets Section */}
          <div className="lg:border-l lg:pl-4 space-y-2">
            <h3 className="font-medium text-sm">預設期間</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1">
              {PRESETS.map((preset) => (
                <PresetButton
                  key={preset.name}
                  preset={preset.name}
                  label={preset.label}
                  isSelected={selectedPreset === preset.name}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false)
              resetValues()
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false)
              if (!areRangesEqual(range, openedRangeRef.current)) {
                onUpdate?.({ range })
              }
            }}
          >
            更新
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateRangePicker.displayName = "DateRangePicker"
