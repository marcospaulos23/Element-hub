
import * as React from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export type FilterPeriod = "today" | "week" | "month" | "all" | "custom";

interface DashboardFilterProps {
    period: FilterPeriod;
    dateRange: DateRange | undefined;
    onPeriodChange: (period: FilterPeriod) => void;
    onDateRangeChange: (range: DateRange | undefined) => void;
}

export function DashboardFilter({
    period,
    dateRange,
    onPeriodChange,
    onDateRangeChange,
}: DashboardFilterProps) {
    const [open, setOpen] = React.useState(false);

    // Helper to format the button text
    const getButtonText = () => {
        if (period === "today") return "Hoje";
        if (period === "week") return "Últimos 7 dias";
        if (period === "month") return "Últimos 30 dias";
        if (period === "all") return "Todo o tempo";

        if (dateRange?.from) {
            if (dateRange.to) {
                return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
            }
            return format(dateRange.from, "dd/MM/yyyy");
        }

        return "Selecione o período";
    };

    const handlePresetClick = (newPeriod: FilterPeriod) => {
        onPeriodChange(newPeriod);
        if (newPeriod !== "custom") {
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[240px] justify-between text-left font-normal bg-white hover:bg-gray-50 text-black hover:text-black shadow-sm"
                    )}
                >
                    <span className="truncate">{getButtonText()}</span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <div className="flex flex-col border-b p-2 space-y-1">
                    <Button
                        variant="ghost"
                        className="justify-start font-normal h-8"
                        onClick={() => handlePresetClick("today")}
                    >
                        Hoje
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start font-normal h-8"
                        onClick={() => handlePresetClick("week")}
                    >
                        Últimos 7 dias
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start font-normal h-8"
                        onClick={() => handlePresetClick("month")}
                    >
                        Últimos 30 dias
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start font-normal h-8"
                        onClick={() => handlePresetClick("all")}
                    >
                        Tempo todo
                    </Button>
                </div>
                <div className="p-2">
                    <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => {
                            onDateRangeChange(range);
                            if (range) onPeriodChange("custom");
                        }}
                        numberOfMonths={1}
                        locale={ptBR}
                        initialFocus
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
