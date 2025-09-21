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
import { Badge } from "./badge";
import { Checkbox } from './checkbox'

export type OptionType<T extends string | number | boolean> = {
    label: string;
    value: T;
}

interface MultiSelectProps<T extends string | number | boolean> {
    options: OptionType<T>[];
    selected: Array<T>;
    onChange: React.Dispatch<React.SetStateAction<T[]>>;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

function MultiSelect<T extends string | number | boolean>({
    options,
    selected,
    onChange,
    className,
    placeholder,
    disabled,
    ...props
}: MultiSelectProps<T>) {
    const [open, setOpen] = React.useState(false)
    const selectRef = React.useRef<HTMLButtonElement>(null);
    const hiddenRef = React.useRef<HTMLDivElement>(null);
    const moreRef = React.useRef<HTMLSpanElement>(null);
    const [popoverWidth, setPopoverWidth] = React.useState(0);

    const [visibleTags, setVisibleTags] = React.useState<T[]>([]);
    const [hiddenCount, setHiddenCount] = React.useState(0);

    // 監聽按鈕寬度變化 → 取得 popoverWidth
    React.useEffect(() => {
        const updatePopWidth = () => {
            if (selectRef.current) {
                setPopoverWidth(selectRef.current.offsetWidth);
            }
        };
        updatePopWidth();

        const resizeObserver = new ResizeObserver(updatePopWidth);
        if (selectRef.current) {
            resizeObserver.observe(selectRef.current);
        }
        window.addEventListener('resize', updatePopWidth);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updatePopWidth);
        };
    }, []);

    // 將 value 對應成 label
    const mapValueToLabel = (value: T) => {
        const option = options.find((option) => option.value === value)
        return option?.label || String(value)
    }

    // 計算可顯示多少個標籤，並同時預留「+N more」的寬度
    const calculateVisibleTags = React.useCallback(() => {
        if (!selectRef.current || !hiddenRef.current) return;

        // 按鈕可用寬度，扣除右側 ChevronDown 的空間
        const containerWidth = selectRef.current.offsetWidth - 50;

        // 取得隱藏容器裡的所有 Badge DOM
        const badgeEls = Array.from(hiddenRef.current.querySelectorAll('.badge-item')) as HTMLElement[];

        // 1) 先「忽略 +N more」的寬度，盡量塞 Badge
        let totalWidth = 0;
        let visibleCount = 0;

        for (let i = 0; i < badgeEls.length; i++) {
            const w = badgeEls[i].offsetWidth;
            if (totalWidth + w <= containerWidth) {
                totalWidth += w;
                visibleCount++;
            } else {
                // 放不下了就停止
                break;
            }
        }

        // 計算剩餘標籤
        let hiddenCount = badgeEls.length - visibleCount;

        // 2) 若還有剩餘標籤，代表要顯示「+N more」
        if (hiddenCount > 0) {
            // 測量「+N more」的寬度
            const plusMoreWidth = moreRef.current ? moreRef.current.offsetWidth : 0;

            // 檢查是否能放下「+N more」
            if (totalWidth + plusMoreWidth > containerWidth) {
                // 如果空間不夠，就把最後一個 Badge 移除，空出空間給 +N more
                if (visibleCount > 0) {
                    const lastBadgeW = badgeEls[visibleCount - 1].offsetWidth;
                    totalWidth -= lastBadgeW;
                    visibleCount--;
                    hiddenCount++;
                }
                // 若本來就沒有任何 badge，則顯示 0 個 badge + N more
            }
        }

        // 最後將 visibleCount 個標籤設定為顯示
        setVisibleTags(selected.slice(0, visibleCount));
        setHiddenCount(hiddenCount);
    }, [selected]);

    // selected 或按鈕尺寸改變時，重新計算可見標籤
    React.useEffect(() => {
        calculateVisibleTags();
    }, [selected, calculateVisibleTags]);

    React.useEffect(() => {
        const observer = new ResizeObserver(calculateVisibleTags);
        if (selectRef.current) {
            observer.observe(selectRef.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [calculateVisibleTags]);

    React.useEffect(() => {
        window.addEventListener('resize', calculateVisibleTags);
        return () => {
            window.removeEventListener('resize', calculateVisibleTags);
        };
    }, [calculateVisibleTags]);

    // 全選 / 全不選
    const checked = React.useMemo(() => selected.length === options.length, [selected, options]);
    const onCheckAll = (isChecked: boolean) => {
        if (!isChecked) {
            onChange([]);
        } else {
            onChange(options.map((option) => option.value));
        }
    }

    // 移除單個選項
    const handleUnselect = (item: T) => {
        onChange(selected.filter((i) => i !== item));
    }

    const emptyRef = React.useRef<HTMLDivElement>(null)
    const [isSelectall, setIsSelectall] = React.useState(true)
    const [checkedAll, setCheckedAll] = React.useState(false)

    React.useEffect(() => {
        if (!emptyRef.current) {
            setIsSelectall(true)
        } else {
            setIsSelectall(false)
        }
    }, [checkedAll])

    const onCheckEmpty = () => {
        setCheckedAll(prev => !prev)
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
                        "w-full justify-between",
                        selected.length > 1 ? "h-full max-h-12" : "h-10"
                    )}
                    disabled={disabled}
                    onClick={() => setOpen(!open)}
                >
                    {/* 已選項目 */}
                    {selected.length ? (
                        <div className="flex items-center gap-1 w-full overflow-hidden">
                            {visibleTags.map((item) => (
                                <Badge
                                    key={String(item)}
                                    variant="outline"
                                    className="badge-item mr-1 mb-1 bg-white border border-solid border-slate-400 shadow-md"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleUnselect(item);
                                    }}
                                >
                                    {mapValueToLabel(item)}
                                    <button
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleUnselect(item);
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))}
                            {hiddenCount > 0 && (
                                <span className="text-muted-foreground ml-1">
                                    +{hiddenCount} more
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-[#64748b]">
                            {placeholder}
                        </span>
                    )}
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            {/* 隱藏容器：渲染所有 Badge + dummy +N more */}
            <div
                ref={hiddenRef}
                className="absolute top-0 left-0 invisible pointer-events-none h-0 overflow-hidden"
            >
                {selected.map((item) => (
                    <Badge
                        key={String(item)}
                        variant="outline"
                        className="badge-item mr-1 mb-1 bg-white border border-solid border-slate-400 shadow-md"
                    >
                        {mapValueToLabel(item)}
                        <button className="ml-1">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                {/* 用較大值作為參考，避免實際數字影響寬度 */}
                <span ref={moreRef} className="ml-1 text-muted-foreground">
                    +99 more
                </span>
            </div>

            {/* 下拉選單 - 改用 minWidth: popoverWidth */}
            <PopoverContent
                className="p-0 overflow-visible"
                style={{
                    pointerEvents: "auto",
                    zIndex: 999,
                    // 讓選單至少跟按鈕同寬，但內容過多可自動撐開
                    minWidth: popoverWidth,
                }}
            >
                <Command
                    className={cn(
                        // 讓內部可自動擴展，而不會被固定死
                        "max-w-full pointer-events-auto",
                        className
                    )}
                >
                    <CommandInput className='pointer-events-auto' placeholder="Search ..." onValueChange={onCheckEmpty} />
                    <CommandList
                        className="max-h-64 overflow-auto"
                        onWheel={(e) => {
                            const target = e.currentTarget;
                            target.scrollTop += e.deltaY;
                        }}
                    >
                        <CommandEmpty ref={emptyRef}>No item found.</CommandEmpty>
                        {isSelectall && < div className="flex gap-2 px-3 pt-2 pb-1">
                            <Checkbox
                                id="selectAll"
                                checked={checked}
                                onCheckedChange={onCheckAll}
                            />
                            <label
                                htmlFor="selectAll"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                全選
                            </label>
                        </div>}
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={String(option.value)}
                                    onSelect={() => {
                                        onChange(
                                            selected.includes(option.value)
                                                ? selected.filter((item) => item !== option.value)
                                                : [...selected, option.value]
                                        )
                                        // 下拉清單保持展開
                                        setOpen(true)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(option.value)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover >
    )
}

export { MultiSelect }
