"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
    const [selectedHour, setSelectedHour] = React.useState("12");
    const [selectedMinute, setSelectedMinute] = React.useState("00");
    const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(
        "AM"
    );

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const hours =
                selectedPeriod === "PM" && selectedHour !== "12"
                    ? parseInt(selectedHour) + 12
                    : selectedHour === "12" && selectedPeriod === "AM"
                    ? 0
                    : parseInt(selectedHour);

            selectedDate.setHours(hours);
            selectedDate.setMinutes(parseInt(selectedMinute));
            setDate(selectedDate);
        } else {
            setDate(undefined);
        }
    };

    const handleTimeChange = (
        newHour: string,
        newMinute: string,
        newPeriod: "AM" | "PM"
    ) => {
        setSelectedHour(newHour);
        setSelectedMinute(newMinute);
        setSelectedPeriod(newPeriod);

        if (date) {
            const newDate = new Date(date);
            const hours =
                newPeriod === "PM" && newHour !== "12"
                    ? parseInt(newHour) + 12
                    : newHour === "12" && newPeriod === "AM"
                    ? 0
                    : parseInt(newHour);

            newDate.setHours(hours);
            newDate.setMinutes(parseInt(newMinute));
            setDate(newDate);
        }
    };

    React.useEffect(() => {
        if (date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            setSelectedHour(
                hours === 0
                    ? "12"
                    : hours > 12
                    ? (hours - 12).toString()
                    : hours.toString()
            );
            setSelectedMinute(minutes.toString().padStart(2, "0"));
            setSelectedPeriod(hours >= 12 ? "PM" : "AM");
        }
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "PPP p")
                    ) : (
                        <span>Pick a date and time</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                <div className="flex items-center justify-center p-2 border-t">
                    <Clock className="mr-2 h-4 w-4" />
                    <Select
                        value={selectedHour}
                        onValueChange={(value) =>
                            handleTimeChange(
                                value,
                                selectedMinute,
                                selectedPeriod
                            )
                        }
                    >
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (hour) => (
                                    <SelectItem
                                        key={hour}
                                        value={hour.toString()}
                                    >
                                        {hour.toString().padStart(2, "0")}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                    <span className="mx-2">:</span>
                    <Select
                        value={selectedMinute}
                        onValueChange={(value) =>
                            handleTimeChange(
                                selectedHour,
                                value,
                                selectedPeriod
                            )
                        }
                    >
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="Minute" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => i).map(
                                (minute) => (
                                    <SelectItem
                                        key={minute}
                                        value={minute
                                            .toString()
                                            .padStart(2, "0")}
                                    >
                                        {minute.toString().padStart(2, "0")}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedPeriod}
                        onValueChange={(value) =>
                            handleTimeChange(
                                selectedHour,
                                selectedMinute,
                                value as "AM" | "PM"
                            )
                        }
                    >
                        <SelectTrigger className="w-[70px] ml-2">
                            <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    );
}
