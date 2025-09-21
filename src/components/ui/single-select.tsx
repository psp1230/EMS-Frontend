import * as React from 'react'
import { cn } from "@/lib/utils"
import { Check, X, ChevronDown } from "lucide-react"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export type OptionType<T extends string | number | boolean | undefined> = {
  label: string;
  value: T;
  description?: string;
}

interface SingleSelectProps<T extends string | number | boolean | undefined> {
  options: OptionType<T>[];
  selected: T;
  clearable?: boolean;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  onValueChange?: (value: T) => void;
  className?: string;
  outsideClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  nocancel?: boolean;
  search?: boolean;
}

function SingelSelect<T extends string | number | boolean | undefined>({
  options,
  selected,
  onChange,
  clearable,
  className,
  outsideClassName,
  placeholder,
  nocancel = true,
  disabled,
  search,
  onValueChange,
  ...props
}: SingleSelectProps<T>) {

  const [open, setOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLButtonElement>(null)
  const popoverRef = React.useRef<HTMLDivElement>(null)
  const [popoverWidth, setPopoverWidth] = React.useState(0)

  // 取得「按鈕寬度」並更新 popoverWidth
  const updatePopWidth = React.useCallback(() => {
    if (selectRef.current) {
      setPopoverWidth(selectRef.current.offsetWidth)
    }
  }, [])

  React.useEffect(() => {
    updatePopWidth() // 初始化

    // 監聽按鈕尺寸變化
    const resizeObserver = new ResizeObserver(updatePopWidth)
    if (selectRef.current) {
      resizeObserver.observe(selectRef.current)
    }

    // 監聽整個視窗尺寸變化
    window.addEventListener('resize', updatePopWidth)

    return () => {
      if (selectRef.current) {
        resizeObserver.unobserve(selectRef.current)
      }
      window.removeEventListener('resize', updatePopWidth)
    }
  }, [updatePopWidth])

  // 清空選擇
  const handleUnselect = () => {
    onChange?.("" as T)
    onValueChange?.("" as T)
  }

  // 找到對應的 label
  const mapValueToLabel = (value: T) => {
    const option = options.find((opt) => opt.value === value)
    return option?.label || String(value ?? "")
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          ref={selectRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between items-center py-1 px-2 w-full",
            outsideClassName
          )}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          {selected !== undefined && selected !== "" ? (
            <div className="flex justify-between w-full">
              {mapValueToLabel(selected)}
              {clearable && (
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect()
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleUnselect()
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-[#64748b]">
              {placeholder}
            </span>
          )}
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* 下拉框：設定 minWidth 為按鈕寬度，內容若超過則自動撐大 */}
      <PopoverContent
        style={{
          pointerEvents: "auto",
          minWidth: popoverWidth,
        }}
        className="p-0"
      >
        <Command ref={popoverRef} className={cn("max-w-full", className)}>
          {search && <CommandInput placeholder="Search ..." />}
          <CommandList
            className="max-h-64 overflow-auto"
            onWheel={(e) => {
              e.stopPropagation()
              const target = e.currentTarget
              target.scrollTop += e.deltaY
            }}
          >
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={
                    typeof option.value === "boolean"
                      ? option.value.toString()
                      : option.value
                  }
                  className="teamaspace-y-1 flex items-start px-4 py-2"
                  onSelect={() => {
                    if (nocancel) {
                      onChange?.(option.value)
                      onValueChange?.(option.value)
                    } else {
                      const newValue =
                        selected === option.value
                          ? (undefined as unknown as T)
                          : option.value
                      onChange?.(newValue)
                      onValueChange?.(newValue)
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{option.label}</p>
                    {option.description && (
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { SingelSelect }
