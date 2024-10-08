"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SleepData {
  sleepDebt: number;
  sleepDebtDelta: number;
  deepSleep: number;
  lightSleep: number;
  awake: number;
  sumDuration: number;
}

interface WeeklyData {
  day: string;
  sleep: number;
  deep: number;
  light: number;
  awake: number;
}

const Sleep = () => {
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [selectedSleepStage, setSelectedSleepStage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const response = await fetch("/api/sleep-data");
        const data = await response.json();
        setSleepData(data.sleepData);
        setWeeklyData(data.weeklyData);
      } catch (error) {
        console.error("Error fetching sleep data:", error);
      }
    };

    fetchSleepData();
  }, []);

  if (!sleepData) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

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
            <div className="flex justify-between items-end h-48 px-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="relative w-6 bg-gray-100 rounded-lg overflow-hidden"
                    style={{ height: "160px" }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[#7B2CBF]  "
                      style={{
                        height: `${(day.deep / day.sleep) * 160}px`,
                        borderBottomLeftRadius: "1rem",
                        borderBottomRightRadius: "1rem",
                      }}
                    ></div>
                    <div
                      className="absolute left-0 right-0 bg-[#C77DFF]"
                      style={{
                        height: `${(day.light / day.sleep) * 160}px`,
                        bottom: `${(day.deep / day.sleep) * 160}px`,
                      }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 right-0 bg-red-400 rounded-t-lg"
                      style={{
                        height: `${(day.awake / day.sleep) * 160}px`,
                        borderTopLeftRadius: "1rem",
                        borderTopRightRadius: "1rem",
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs">{day.day}</div>
                  <div className="text-xs font-semibold">{day.sleep}h</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#7B2CBF] rounded-full mr-1"></div>
                <span className="text-xs">Deep</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#C77DFF] rounded-full mr-1"></div>
                <span className="text-xs">Light</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                <span className="text-xs">Awake</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sleep;
