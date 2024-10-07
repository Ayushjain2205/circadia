import Layout from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ChevronRight, Coins, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";

type ScoreType = "sleep" | "activity" | "health";
type Metric = {
  name: string;
  value: number;
  unit: string;
  emoji: string;
  trend: "up" | "down" | "neutral";
};

interface ScoreData {
  score: number;
  metrics: Metric[];
}

export default function HomePage() {
  const [overallScore, setOverallScore] = useState(85);
  const [coinCount, setCoinCount] = useState(230);
  const [scores, setScores] = useState<Record<ScoreType, ScoreData>>({
    sleep: {
      score: 80,
      metrics: [
        {
          name: "Sleep Debt",
          value: 1.5,
          unit: "hours",
          emoji: "💤",
          trend: "down",
        },
        {
          name: "Deep Sleep",
          value: 2.3,
          unit: "hours",
          emoji: "🌙",
          trend: "up",
        },
        {
          name: "Time Slept",
          value: 7.5,
          unit: "hours",
          emoji: "⏰",
          trend: "neutral",
        },
      ],
    },
    activity: {
      score: 75,
      metrics: [
        { name: "Steps", value: 8500, unit: "steps", emoji: "👣", trend: "up" },
        {
          name: "Physical Activity",
          value: 45,
          unit: "minutes",
          emoji: "🏋️‍♂️",
          trend: "up",
        },
      ],
    },
    health: {
      score: 90,
      metrics: [
        {
          name: "Heart Health",
          value: 95,
          unit: "%",
          emoji: "❤️",
          trend: "up",
        },
        {
          name: "Resting Heart Rate",
          value: 62,
          unit: "bpm",
          emoji: "💓",
          trend: "down",
        },
      ],
    },
  });

  const [selectedScore, setSelectedScore] = useState<ScoreType | null>(null);

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🌟";
    if (score >= 80) return "😊";
    if (score >= 70) return "🙂";
    if (score >= 60) return "😐";
    return "😟";
  };

  const getTrendArrow = (trend: "up" | "down" | "neutral") => {
    if (trend === "up") return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <ArrowDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <Layout>
      <div className="flex-1 p-4 pb-24">
        {/* Coin Count */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex items-center bg-[#E2CFEA] text-[#7B2CBF] rounded-full py-1 px-3">
            <Image
              src="/coin.svg"
              alt="Coins"
              className="mr-1"
              width={30}
              height={30}
            />
            <span className="text-sm font-semibold">{coinCount}</span>
          </div>
        </div>

        {/* Overall Wellness Score */}
        <Card className="mb-6 border-none shadow-lg bg-[#7B2CBF] ">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-semibold mb-2 text-white">
              Circadian Score
            </h2>
            <div className="text-7xl font-bold text-white flex items-center">
              {overallScore} {getScoreEmoji(overallScore)}
            </div>
            <div className="text-sm mt-2 text-white">
              Powered by Circadia AI
            </div>
          </CardContent>
        </Card>

        {/* Individual Scores */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {(["sleep", "activity", "health"] as ScoreType[]).map((type) => (
            <Card
              key={type}
              className={`cursor-pointer transition-all border-2 ${
                selectedScore === type
                  ? "border-[#7B2CBF]"
                  : "border-transparent"
              }`}
              onClick={() =>
                setSelectedScore(selectedScore === type ? null : type)
              }
            >
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="text-3xl mb-2">
                  {type === "sleep" && "😴"}
                  {type === "activity" && "🏃‍♂️"}
                  {type === "health" && "❤️"}
                </div>
                <h3 className="text-lg font-semibold capitalize mb-1">
                  {type}
                </h3>
                <div className="text-2xl font-bold text-[#7B2CBF]">
                  {scores[type].score}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Metrics for Selected Score */}
        {selectedScore && (
          <Card className="mb-6 border-2 border-[#E2CFEA]">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold capitalize mb-4 text-[#7B2CBF]">
                {selectedScore} Metrics
              </h3>
              <ul className="space-y-3">
                {scores[selectedScore].metrics.map((metric, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{metric.emoji}</span>
                      {metric.name}
                    </span>
                    <span className="font-semibold text-[#7B2CBF] flex items-center">
                      {metric.value} {metric.unit}
                      <span className="ml-2">
                        {getTrendArrow(metric.trend)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        {/* <Card className="mb-6 border-2 border-[#7B2CBF]">
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-[#7B2CBF] flex items-center">
              <Brain className="w-6 h-6 mr-2" /> AI Insights
            </h3>
            <p className="text-sm mb-2">
              Your sleep pattern shows improvement. Consider going to bed 15
              minutes earlier to optimize your circadian rhythm.
            </p>
            <Button className="w-full mt-2 bg-[#7B2CBF] text-white hover:bg-[#E2CFEA] hover:text-[#7B2CBF]">
              View Detailed Analysis
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </Layout>
  );
}
