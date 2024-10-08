"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { User, ArrowUp, ArrowDown, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";

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

interface OverallData {
  overallScore: number;
  coinCount: number;
  scores: Record<ScoreType, ScoreData>;
}

export default function HomePage() {
  const [overallScore, setOverallScore] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [scores, setScores] = useState<Record<ScoreType, ScoreData>>({
    sleep: { score: 0, metrics: [] },
    activity: { score: 0, metrics: [] },
    health: { score: 0, metrics: [] },
  });

  const [selectedScore, setSelectedScore] = useState<ScoreType | null>(null);
  const [isGlowing, setIsGlowing] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/overall-data");
        const data: OverallData = await response.json();
        setOverallScore(data.overallScore);
        setCoinCount(data.coinCount);
        setScores(data.scores);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing((prev) => !prev);
    }, 1000);

    return () => clearInterval(glowInterval);
  }, []);

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

  const handleCoinClick = () => {
    if (!isClaimed) {
      setShowPopup(true);
    }
  };

  const handleClaim = () => {
    setCoinCount((prev) => prev + 10);
    setIsClaimed(true);
    setShowPopup(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 p-4 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 p-4 pb-24">
        {/* Coin Count */}
        <div className="flex justify-between mb-4">
          <Link href="/profile">
            <div className="inline-flex items-center bg-[#E2CFEA] text-[#7B2CBF] rounded-full p-2">
              <User className="w-6 h-6" />
            </div>
          </Link>
          <div
            className={`inline-flex items-center bg-[#E2CFEA] text-[#7B2CBF] rounded-full py-1 px-3 cursor-pointer transition-all duration-300 ${
              isGlowing && !isClaimed
                ? "shadow-[0_0_15px_5px_rgba(123,44,191,0.5)]"
                : ""
            }`}
            onClick={handleCoinClick}
          >
            <Flower className="w-6 h-6" />
            <span className="ml-1 text-sm font-semibold">{coinCount}</span>
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

        {/* Popup for winning coins */}
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent className="bg-[#F3E8FF] border-2 border-[#7B2CBF] rounded-3xl max-w-[300px] p-0 [&>button]:hidden">
            <div className="bg-[#7B2CBF] p-4 rounded-t-2xl">
              <DialogHeader>
                <DialogTitle className="text-white text-center text-2xl font-bold">
                  Congratulations! 🎉
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-[#E2CFEA] rounded-full p-6">
                  <Flower className="w-16 h-16 text-[#7B2CBF]" />
                </div>
                <DialogDescription className="text-center text-[#7B2CBF] text-lg font-semibold">
                  You've won wellness coins!
                </DialogDescription>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  onClick={handleClaim}
                  className="w-full bg-[#7B2CBF] hover:bg-[#9D4EDD] outline-none text-white font-bold py-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Flower className="w-5 h-5 mr-2" />
                  Claim 10 Coins
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
