import { NextApiRequest, NextApiResponse } from "next";

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

function generateRandomScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomTrend(): "up" | "down" | "neutral" {
  const trends = ["up", "down", "neutral"];
  return trends[Math.floor(Math.random() * trends.length)] as
    | "up"
    | "down"
    | "neutral";
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OverallData>
) {
  const overallScore = generateRandomScore(50, 90);
  const coinCount = generateRandomScore(100, 500);

  const scores: Record<ScoreType, ScoreData> = {
    sleep: {
      score: generateRandomScore(60, 100),
      metrics: [
        {
          name: "Sleep Debt",
          value: parseFloat((Math.random() * 3).toFixed(1)),
          unit: "hours",
          emoji: "💤",
          trend: generateRandomTrend(),
        },
        {
          name: "Deep Sleep",
          value: parseFloat((Math.random() * 3).toFixed(1)),
          unit: "hours",
          emoji: "🌙",
          trend: generateRandomTrend(),
        },
        {
          name: "Time Slept",
          value: parseFloat((Math.random() * 4 + 5).toFixed(1)),
          unit: "hours",
          emoji: "⏰",
          trend: generateRandomTrend(),
        },
      ],
    },
    activity: {
      score: generateRandomScore(60, 100),
      metrics: [
        {
          name: "Steps",
          value: generateRandomScore(5000, 15000),
          unit: "steps",
          emoji: "👣",
          trend: generateRandomTrend(),
        },
        {
          name: "Physical Activity",
          value: generateRandomScore(30, 120),
          unit: "minutes",
          emoji: "🏋️‍♂️",
          trend: generateRandomTrend(),
        },
      ],
    },
    health: {
      score: generateRandomScore(60, 100),
      metrics: [
        {
          name: "Heart Health",
          value: generateRandomScore(70, 100),
          unit: "%",
          emoji: "❤️",
          trend: generateRandomTrend(),
        },
        {
          name: "Resting Heart Rate",
          value: generateRandomScore(50, 80),
          unit: "bpm",
          emoji: "💓",
          trend: generateRandomTrend(),
        },
      ],
    },
  };

  res.status(200).json({ overallScore, coinCount, scores });
}
