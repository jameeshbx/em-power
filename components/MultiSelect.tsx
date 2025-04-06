import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (values: string[], selectedObjects?: Option[]) => void;
    placeholder?: string;
    className?: string;
    error?: boolean;
}

export function MultiSelect({
    options,
    selected = [],
    onChange,
    placeholder = "Select options...",
    className,
    error
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedLabels = options
        .filter((option) => selected.includes(option.value))
        .map((option) => option.label)
        .join(", ");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between max-w-[470px]",
                        error ? "border-red-500" : "",
                        className
                    )}
                >
                    <span className="truncate">
                        {selectedLabels || placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <div className="max-h-64 overflow-auto p-2">
                    {options.length === 0 ? (
                        <div className="py-2 px-3 text-sm text-muted-foreground">
                            No options found.
                        </div>
                    ) : (
                        options.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center py-2 px-3 cursor-pointer hover:bg-accent"
                                onClick={() => {
                                    const newSelected = selected.includes(option.value)
                                        ? selected.filter((value) => value !== option.value)
                                        : [...selected, option.value];
                                    const selectedObjects = options.filter(opt =>
                                        newSelected.includes(opt.value)
                                    );
                                    onChange(newSelected, selectedObjects);
                                }}
                            >
                                <Checkbox
                                    checked={selected.includes(option.value)}
                                    className="mr-2"
                                />
                                {option.label}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}