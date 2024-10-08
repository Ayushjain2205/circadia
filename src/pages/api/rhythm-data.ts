import { NextApiRequest, NextApiResponse } from "next";

type PhaseData = {
  time: string;
};

function generateRandomTime(hour: number): string {
  const randomMinute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, "0")}:${randomMinute
    .toString()
    .padStart(2, "0")}`;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhaseData[]>
) {
  const rhythmData: PhaseData[] = [
    { time: generateRandomTime(2) }, // Deep Sleep
    { time: generateRandomTime(6) }, // Wake Up
    { time: generateRandomTime(10) }, // Peak Alertness
    { time: generateRandomTime(14) }, // Peak Cognition
    { time: generateRandomTime(18) }, // Fastest Reactions
    { time: generateRandomTime(22) }, // Melatonin Release
  ];

  res.status(200).json(rhythmData);
}
