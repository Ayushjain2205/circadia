import { NextApiRequest, NextApiResponse } from "next";

type DayData = {
  date: string;
  steps: number;
};

type ActivityData = {
  averageSteps: number;
  monthData: DayData[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivityData>
) {
  const { year, month } = req.query;

  if (!year || !month) {
    return res
      .status(400)
      .json({ error: "Year and month are required" } as any);
  }

  const currentYear = parseInt(year as string);
  const currentMonth = parseInt(month as string) - 1; // JavaScript months are 0-indexed

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthData: DayData[] = Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(currentYear, currentMonth, i + 1)
      .toISOString()
      .split("T")[0],
    steps: Math.floor(Math.random() * 15000) + 2000,
  }));

  const averageSteps = Math.round(
    monthData.reduce((sum, day) => sum + day.steps, 0) / daysInMonth
  );

  const activityData: ActivityData = {
    averageSteps,
    monthData,
  };

  res.status(200).json(activityData);
}
