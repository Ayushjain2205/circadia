"use client";

import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";

const Sleep = () => {
  const sleepData = {
    sleepDebt: 9.5, // in hours
    sleepDebtDelta: 0.5, // increase of 0.5 hours since yesterday
    deepRatio: 10,
    shallowRatio: 86,
    awakeRatio: 4,
    sumDuration: 431,
  };

  const weeklyData = [
    { day: "M", sleep: 7.2 },
    { day: "T", sleep: 6.8 },
    { day: "W", sleep: 7.5 },
    { day: "T", sleep: 6.5 },
    { day: "F", sleep: 7.0 },
    { day: "S", sleep: 8.2 },
    { day: "S", sleep: 7.8 },
  ];

  const getSleepDebtEmoji = (debt: number) => {
    if (debt <= 0) return "😊";
    if (debt <= 4) return "😐";
    if (debt <= 8) return "😴";
    return "😫";
  };

  const getTrendArrow = (change: number) => {
    if (change > 0)
      return (
        <div className="flex items-center justify-center text-red-500">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-xs font-medium">+{change.toFixed(1)} hrs</span>
        </div>
      );
    if (change < 0)
      return (
        <div className="flex items-center justify-center text-green-500">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span className="text-xs font-medium">{change.toFixed(1)} hrs</span>
        </div>
      );
    return (
      <div className="flex items-center justify-center text-gray-400">
        <span className="text-xs font-medium">No change</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Sleep Debt Card */}
        <div className="flex justify-center">
          <Card className="w-64 h-64 border-none shadow-lg overflow-hidden bg-[#7B2CBF] ">
            <CardContent className="p-4 flex flex-col items-center justify-between h-full text-white">
              <div className="text-lg font-semibold">Sleep Debt</div>
              <div className="text-center">
                <div className="text-6xl font-bold flex items-center justify-center">
                  <span>{sleepData.sleepDebt.toFixed(1)}</span>
                  <span className="ml-2">
                    {getSleepDebtEmoji(sleepData.sleepDebt)}
                  </span>
                </div>
                <div className="text-2xl">hrs</div>
              </div>
              <div className="text-sm flex flex-col items-center">
                <span className="mb-1">Since yesterday</span>
                {getTrendArrow(sleepData.sleepDebtDelta)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sleep Quality Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold">Sleep Quality</div>
              <div className="text-2xl font-bold text-[#7B2CBF]">
                {Math.round(sleepData.sumDuration / 60)}h
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-20 text-sm">Deep</div>
                <Progress
                  value={sleepData.deepRatio}
                  className="flex-1 h-2"
                  indicatorClassName="bg-[#7B2CBF]"
                />
                <div className="w-12 text-right text-sm">
                  {sleepData.deepRatio}%
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-sm">Light</div>
                <Progress
                  value={sleepData.shallowRatio}
                  className="flex-1 h-2"
                  indicatorClassName="bg-[#9D4EDD]"
                />
                <div className="w-12 text-right text-sm">
                  {sleepData.shallowRatio}%
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-sm">Awake</div>
                <Progress
                  value={sleepData.awakeRatio}
                  className="flex-1 h-2"
                  indicatorClassName="bg-[#C77DFF]"
                />
                <div className="w-12 text-right text-sm">
                  {sleepData.awakeRatio}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Sleep Chart */}
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold mb-4">Weekly Sleep</div>
            <div className="flex justify-between items-end h-40">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative w-8 bg-gray-200 rounded-t-full overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-[#7B2CBF] rounded-t-full"
                      style={{ height: `${(day.sleep / 10) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs">{day.day}</div>
                  <div className="text-xs font-semibold">{day.sleep}h</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sleep;
