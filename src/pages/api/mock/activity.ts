import { NextApiRequest, NextApiResponse } from "next";

const CUDIS_API_BASE_URL = "https://api.cudis.ai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { startTime, endTime, type } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({ error: "Missing startTime or endTime" });
  }

  if (type === "step") {
    return getStepCount(req, res);
  }

  try {
    const response = await fetch(
      `${CUDIS_API_BASE_URL}/partner/v1/query/heart_beat`,
      {
        method: "GET",
        headers: {
          "Cudis-Client-Id": process.env.CUDIS_CLIENT_ID || "",
          Authorization: `Bearer ${process.env.CUDIS_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, endTime }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch heartbeat data");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching heartbeat data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getStepCount(req: NextApiRequest, res: NextApiResponse) {
  const { startTime, endTime } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({ error: "Missing startTime or endTime" });
  }

  try {
    const response = await fetch(
      `${CUDIS_API_BASE_URL}/partner/v1/query/step`,
      {
        method: "GET",
        headers: {
          "Cudis-Client-Id": process.env.CUDIS_CLIENT_ID || "",
          Authorization: `Bearer ${process.env.CUDIS_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, endTime }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch step count data");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching step count data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
