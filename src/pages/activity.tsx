"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DayData = {
  date: string;
  steps: number;
};

type ActivityData = {
  averageSteps: number;
  monthData: DayData[];
};

const Activity = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activityData, setActivityData] = useState<ActivityData | null>(null);

  const today = new Date();
  const isCurrentMonthLatest =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  useEffect(() => {
    fetchActivityData();
  }, [currentMonth]);

  const fetchActivityData = async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const response = await fetch(
      `/api/activity-data?year=${year}&month=${month}`
    );
    const data: ActivityData = await response.json();
    setActivityData(data);
  };

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
    if (!isCurrentMonthLatest) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      );
      setSelectedDate(null);
    }
  };

  if (!activityData) {
    return (
      <Layout>
        <div className="flex-1 p-4 pb-24">Loading...</div>
      </Layout>
    );
  }

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
                    {activityData.monthData
                      .find(
                        (day) =>
                          day.date === selectedDate.toISOString().split("T")[0]
                      )
                      ?.steps.toLocaleString()}{" "}
                    steps
                  </p>
                </div>
                <div className="text-6xl">
                  {getActivityEmoji(
                    activityData.monthData.find(
                      (day) =>
                        day.date === selectedDate.toISOString().split("T")[0]
                    )?.steps || 0
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Average Steps</h2>
                  <p className="text-2xl font-bold">
                    {activityData.averageSteps.toLocaleString()}
                  </p>
                </div>
                <div className="text-6xl">
                  {getActivityEmoji(activityData.averageSteps)}
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
          <Button
            onClick={nextMonth}
            variant="outline"
            size="icon"
            disabled={isCurrentMonthLatest}
          >
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
          {activityData.monthData.map((day, index) => {
            const dayDate = new Date(day.date);
            const isInFuture = dayDate > today;
            const isCurrentMonth =
              dayDate.getMonth() === currentMonth.getMonth();

            if (!isCurrentMonth) return null; // Skip days not in the current month

            return (
              <Button
                key={index}
                className={`h-10 w-full ${
                  isInFuture ? "bg-gray-200" : getActivityColor(day.steps)
                } ${
                  selectedDate?.toISOString().split("T")[0] === day.date
                    ? "ring-2 ring-white"
                    : ""
                }`}
                onClick={() => !isInFuture && setSelectedDate(dayDate)}
                disabled={isInFuture}
              >
                <span className="sr-only">{dayDate.getDate()}</span>
              </Button>
            );
          })}
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
