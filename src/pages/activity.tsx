"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for the example
const mockData = {
  averageSteps: 8500,
  monthData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2024, 9, i + 1),
    steps: Math.floor(Math.random() * 15000) + 2000,
  })),
};

const Activity = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 9, 1));

  const getActivityEmoji = (steps: number) => {
    if (steps >= 10000) return "🏃‍♂️";
    if (steps >= 7500) return "👟";
    if (steps >= 5000) return "🚶‍♂️";
    return "🐌";
  };

  const getActivityColor = (steps: number) => {
    if (steps >= 10000) return "bg-[#7B2CBF]"; // Dark purple
    if (steps >= 7500) return "bg-[#9D4EDD]"; // Medium purple
    if (steps >= 5000) return "bg-[#C77DFF]"; // Light purple
    if (steps > 0) return "bg-[#E0AAFF]"; // Very light purple
    return "bg-gray-200"; // No activity
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  return (
    <Layout>
      <div className="flex-1 p-4 pb-24">
        {/* Average Steps or Selected Date Card */}
        <Card className="mb-6 bg-[#7B2CBF] text-white">
          <CardContent className="flex items-center justify-between p-6">
            {selectedDate ? (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {selectedDate.toLocaleDateString("default", {
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <p className="text-2xl font-bold">
                    {mockData.monthData[
                      selectedDate.getDate() - 1
                    ].steps.toLocaleString()}{" "}
                    steps
                  </p>
                </div>
                <div className="text-6xl">
                  {getActivityEmoji(
                    mockData.monthData[selectedDate.getDate() - 1].steps
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Average Steps</h2>
                  <p className="text-2xl font-bold">
                    {mockData.averageSteps.toLocaleString()}
                  </p>
                </div>
                <div className="text-6xl">
                  {getActivityEmoji(mockData.averageSteps)}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <Button onClick={prevMonth} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <Button onClick={nextMonth} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Activity Calendar */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}
          {mockData.monthData.map((day, index) => (
            <Button
              key={index}
              className={`h-10 w-full ${getActivityColor(day.steps)} ${
                selectedDate?.getDate() === day.date.getDate()
                  ? "ring-2 ring-white"
                  : ""
              }`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span className="sr-only">{day.date.getDate()}</span>
            </Button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#E0AAFF] mr-2"></div>
            <span>Less</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#C77DFF] mr-2"></div>
            <div className="w-4 h-4 bg-[#9D4EDD] mr-2"></div>
            <div className="w-4 h-4 bg-[#7B2CBF] mr-2"></div>
            <span>More</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Activity;
