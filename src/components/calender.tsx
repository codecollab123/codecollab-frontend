"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { Card } from "@/components/ui/card";

import "react-day-picker/dist/style.css";

export default function DashboardCalendar() {
  const [selected, setSelected] = useState<Date>();

  return (
    <Card className="bg-[#161616] border border-white/10 p-6 rounded-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <CalendarIcon className="text-yellow-500" />
        <h3 className="text-lg font-semibold text-white">Weekly Calendar</h3>
      </div>

      <div className="bg-[#0f0f0f] rounded-xl p-3 text-white">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="text-white"
        />
      </div>

      {selected && (
        <p className="text-green-400 text-sm mt-3 text-center">
          Selected: {selected.toDateString()}
        </p>
      )}
    </Card>
  );
}
