import { NextApiRequest, NextApiResponse } from "next";

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function roundToOneDecimal(num: number): number {
  return Math.round(num * 10) / 10;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sleepData = {
    sleepDebt: roundToOneDecimal(randomInRange(1, 5)),
    sleepDebtDelta: roundToOneDecimal(randomInRange(-1, 1)),
    deepSleep: Math.round(randomInRange(5, 20)),
    lightSleep: Math.round(randomInRange(70, 90)),
    awake: Math.round(randomInRange(2, 10)),
    sumDuration: Math.round(randomInRange(360, 540)), // 6 to 9 hours in minutes
  };

  // Ensure percentages add up to 100%
  const totalPercentage =
    sleepData.deepSleep + sleepData.lightSleep + sleepData.awake;
  sleepData.lightSleep += 100 - totalPercentage;

  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const sleep = roundToOneDecimal(randomInRange(6, 9));
    const deep = roundToOneDecimal(randomInRange(0.5, 1.5));
    const awake = roundToOneDecimal(randomInRange(0.3, 0.8));
    const light = roundToOneDecimal(sleep - deep - awake);

    return {
      day: ["M", "T", "W", "T", "F", "S", "S"][index],
      sleep,
      deep,
      light,
      awake,
    };
  });

  res.status(200).json({ sleepData, weeklyData });
}
