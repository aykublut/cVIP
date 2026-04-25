"use client";

/**
 * MonthYearPicker — ATS uyumlu ay/yıl seçici.
 *
 * Kullanıcı serbest metin yazamaz; sadece seçer.
 * Değer her zaman "YYYY-MM" ISO formatında tutulur.
 * "Günümüz" seçeneği opsiyoneldir (`allowPresent` prop).
 *
 * Bu komponent shadcn/ui'nin Popover + Button primitiflerini kullanır.
 */

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatStoredDate } from "@/lib/cv-helpers";

interface MonthYearPickerProps {
  value: string; // "YYYY-MM" | "present" | ""
  onChange: (value: string) => void;
  placeholder?: string;
  allowPresent?: boolean;
  disabled?: boolean;
  className?: string;
  locale?: "tr" | "en";
  "aria-label"?: string;
}

const MONTHS_TR = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];
const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  value,
  onChange,
  placeholder = "Tarih seçin",
  allowPresent = false,
  disabled = false,
  className,
  locale = "tr",
  "aria-label": ariaLabel,
}) => {
  const [open, setOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  // Panelde gösterilen yıl — değer varsa o yıl, yoksa şu an
  const [viewYear, setViewYear] = React.useState<number>(() => {
    if (value && value !== "present" && /^\d{4}-\d{2}$/.test(value)) {
      return parseInt(value.slice(0, 4), 10);
    }
    return currentYear;
  });

  // Popover açıldığında viewYear'ı senkronize et
  React.useEffect(() => {
    if (open && value && value !== "present" && /^\d{4}-\d{2}$/.test(value)) {
      setViewYear(parseInt(value.slice(0, 4), 10));
    } else if (open) {
      setViewYear(currentYear);
    }
  }, [open, value, currentYear]);

  const selectedYear =
    value && value !== "present" && /^\d{4}-\d{2}$/.test(value)
      ? parseInt(value.slice(0, 4), 10)
      : null;
  const selectedMonth =
    value && value !== "present" && /^\d{4}-\d{2}$/.test(value)
      ? parseInt(value.slice(5, 7), 10)
      : null;

  const handleSelect = (month: number) => {
    const iso = `${viewYear}-${String(month).padStart(2, "0")}`;
    onChange(iso);
    setOpen(false);
  };

  const handlePresent = () => {
    onChange("present");
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setOpen(false);
  };

  const displayText = value
    ? formatStoredDate(value, locale, "long")
    : placeholder;

  const months = locale === "tr" ? MONTHS_TR : MONTHS_EN;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          className={cn(
            "w-full justify-start text-left font-medium",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-60" />
          <span className="truncate">{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        {/* Yıl navigasyonu */}
        <div className="flex items-center justify-between mb-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewYear((y) => y - 1)}
            aria-label="Önceki yıl"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-bold text-sm tabular-nums">{viewYear}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewYear((y) => y + 1)}
            aria-label="Sonraki yıl"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Ay grid */}
        <div className="grid grid-cols-3 gap-1.5 w-[220px]">
          {months.map((monthName, idx) => {
            const monthNum = idx + 1;
            const isSelected =
              selectedYear === viewYear && selectedMonth === monthNum;
            return (
              <Button
                key={monthNum}
                type="button"
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs font-medium"
                onClick={() => handleSelect(monthNum)}
              >
                {monthName}
              </Button>
            );
          })}
        </div>

        {/* Aksiyonlar */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t">
          {allowPresent ? (
            <Button
              type="button"
              variant={value === "present" ? "default" : "outline"}
              size="sm"
              className="text-[10px] font-black tracking-widest uppercase"
              onClick={handlePresent}
            >
              {locale === "tr" ? "Günümüz" : "Present"}
            </Button>
          ) : (
            <span />
          )}
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[10px] font-medium text-muted-foreground"
              onClick={handleClear}
            >
              {locale === "tr" ? "Temizle" : "Clear"}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
