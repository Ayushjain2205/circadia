"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const Sleep = () => {
  const sleepData = {
    sleepDebt: 2.5,
    sleepDebtDelta: 0.5,
    deepSleep: 10,
    lightSleep: 86,
    awake: 4,
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

  const [selectedSleepStage, setSelectedSleepStage] = useState<string | null>(
    null
  );

  const getSleepDebtEmoji = (debt: number) => {
    if (debt <= 0) return "😊";
    if (debt <= 1) return "😐";
    if (debt <= 3) return "😴";
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

  const avgSleepDuration = Math.round(sleepData.sumDuration / 60);

  const handleSleepStageClick = (stage: string) => {
    setSelectedSleepStage(stage === selectedSleepStage ? null : stage);
  };

  const getSleepStageInfo = (stage: string) => {
    switch (stage) {
      case "deep":
        return {
          name: "Deep Sleep",
          emoji: "😴",
          percentage: sleepData.deepSleep,
          duration: ((avgSleepDuration * sleepData.deepSleep) / 100).toFixed(1),
          color: "bg-[#7B2CBF]",
          textColor: "text-[#7B2CBF]",
        };
      case "light":
        return {
          name: "Light Sleep",
          emoji: "🥱",
          percentage: sleepData.lightSleep,
          duration: ((avgSleepDuration * sleepData.lightSleep) / 100).toFixed(
            1
          ),
          color: "bg-[#C77DFF]",
          textColor: "text-[#C77DFF]",
        };
      case "awake":
        return {
          name: "Awake",
          emoji: "🫣",
          percentage: sleepData.awake,
          duration: ((avgSleepDuration * sleepData.awake) / 100).toFixed(1),
          color: "bg-red-400",
          textColor: "text-red-400",
        };
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Sleep Debt Card */}
        <div className="flex justify-center">
          <Card className="w-64 h-64 border-none shadow-lg overflow-hidden bg-[#7B2CBF]">
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
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Avg Sleep</div>
              <div className="text-2xl font-bold text-[#7B2CBF]">
                {avgSleepDuration}h
              </div>
            </div>
            <div className="flex h-8 w-full rounded-full overflow-hidden mb-4">
              {["deep", "light", "awake"].map((stage) => {
                const info = getSleepStageInfo(stage);
                return (
                  <button
                    key={stage}
                    className={`h-full transition-all duration-300 ${
                      selectedSleepStage === stage
                        ? "ring-2 ring-offset-2 ring-[#7B2CBF]"
                        : ""
                    }`}
                    style={{ width: `${info?.percentage}%` }}
                    onClick={() => handleSleepStageClick(stage)}
                  >
                    <div className={`h-full w-full ${info?.color}`}></div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between">
              {["deep", "light", "awake"].map((stage) => {
                const info = getSleepStageInfo(stage);
                return (
                  <div
                    key={stage}
                    className={`text-center ${
                      selectedSleepStage === stage
                        ? `${info?.textColor} font-bold`
                        : "text-gray-500"
                    }`}
                  >
                    <div className="text-sm">{info?.percentage}%</div>
                    <div className="text-xs">{info?.duration}h</div>
                  </div>
                );
              })}
            </div>
            {selectedSleepStage && (
              <div className="mt-4 text-center">
                <p className="font-semibold text-lg">
                  {getSleepStageInfo(selectedSleepStage)?.name}{" "}
                  {getSleepStageInfo(selectedSleepStage)?.emoji}
                </p>
                <p className="text-sm">
                  {getSleepStageInfo(selectedSleepStage)?.percentage}% -{" "}
                  {getSleepStageInfo(selectedSleepStage)?.duration}h
                </p>
              </div>
            )}
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
