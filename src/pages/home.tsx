import Layout from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Moon,
  Activity,
  User,
  Brain,
  ChevronRight,
  Heart,
  Zap,
} from "lucide-react";
import Link from "next/link";

type ScoreType = "sleep" | "activity" | "health";
type Metric = { name: string; value: number; unit: string };

interface ScoreData {
  score: number;
  metrics: Metric[];
}

export default function HomePage() {
  const [overallScore, setOverallScore] = useState(85);
  const [scores, setScores] = useState<Record<ScoreType, ScoreData>>({
    sleep: {
      score: 80,
      metrics: [
        { name: "Sleep Debt", value: 1.5, unit: "hours" },
        { name: "Deep Sleep", value: 2.3, unit: "hours" },
        { name: "Time Slept", value: 7.5, unit: "hours" },
      ],
    },
    activity: {
      score: 75,
      metrics: [
        { name: "Steps", value: 8500, unit: "steps" },
        { name: "Physical Activity", value: 45, unit: "minutes" },
      ],
    },
    health: {
      score: 90,
      metrics: [
        { name: "Heart Health", value: 95, unit: "%" },
        { name: "Resting Heart Rate", value: 62, unit: "bpm" },
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

  return (
    <Layout>
      <main className="flex-1 p-4 pb-24">
        {/* Overall Wellness Score */}
        <Card className="mb-6 border-none shadow-lg bg-gradient-to-r from-[#7B2CBF] to-[#E2CFEA]">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-semibold mb-2 text-white">
              Wellness AI Score
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
                    <span>{metric.name}</span>
                    <span className="font-semibold text-[#7B2CBF]">
                      {metric.value} {metric.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        <Card className="mb-6 border-2 border-[#7B2CBF]">
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
        </Card>
      </main>
    </Layout>
  );
}
