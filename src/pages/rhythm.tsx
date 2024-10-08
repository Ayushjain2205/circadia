"use client";

import React, { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  Moon,
  Sun,
  Coffee,
  Zap,
  Brain,
  BedDouble,
  Home,
  Activity,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PhaseData = {
  time: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  textColor: string;
};

const phaseConfigs = [
  {
    icon: "Moon",
    title: "Deep Sleep",
    description: "Restorative sleep phase",
    color: "bg-blue-400",
    borderColor: "border-blue-400",
    textColor: "text-blue-400",
  },
  {
    icon: "Sun",
    title: "Wake Up",
    description: "Natural wake-up time",
    color: "bg-yellow-400",
    borderColor: "border-yellow-400",
    textColor: "text-yellow-400",
  },
  {
    icon: "Coffee",
    title: "Peak Alertness",
    description: "High cortisol, good for focused work",
    color: "bg-green-400",
    borderColor: "border-green-400",
    textColor: "text-green-400",
  },
  {
    icon: "Brain",
    title: "Peak Cognition",
    description: "Best time for critical thinking",
    color: "bg-purple-400",
    borderColor: "border-purple-400",
    textColor: "text-purple-400",
  },
  {
    icon: "Zap",
    title: "Fastest Reactions",
    description: "Highest physical performance",
    color: "bg-red-400",
    borderColor: "border-red-400",
    textColor: "text-red-400",
  },
  {
    icon: "BedDouble",
    title: "Melatonin Release",
    description: "Body prepares for sleep",
    color: "bg-indigo-400",
    borderColor: "border-indigo-400",
    textColor: "text-indigo-400",
  },
];

const iconMap = {
  Moon,
  Sun,
  Coffee,
  Zap,
  Brain,
  BedDouble,
};

const Rhythm = () => {
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<PhaseData | null>(null);
  const [cardPosition, setCardPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const curveRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRhythmData = async () => {
      try {
        const response = await fetch("/api/rhythm-data");
        const data: { time: string }[] = await response.json();
        const combinedData = data.map((item, index) => ({
          ...item,
          ...phaseConfigs[index],
        }));
        setPhases(combinedData);
        setSelectedPhase(combinedData[0]);
      } catch (error) {
        console.error("Error fetching rhythm data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRhythmData();
  }, []);

  useEffect(() => {
    if (curveRef.current && cardRef.current && selectedPhase) {
      const index = phases.findIndex((phase) => phase === selectedPhase);
      const totalHeight = curveRef.current.clientHeight;
      const cardHeight = cardRef.current.clientHeight;
      const maxPosition = totalHeight - cardHeight;
      const newPosition = Math.min(
        Math.max(
          (index / (phases.length - 1)) * totalHeight - cardHeight / 2,
          0
        ),
        maxPosition
      );
      setCardPosition(newPosition);
    }
  }, [selectedPhase, phases]);

  return (
    <Layout>
      <div className="flex flex-col items-center p-4 bg-white text-gray-900 min-h-screen">
        <h1 className="text-xl font-bold mb-6 text-[#7B2CBF]">
          Circadian Rhythm Journey
        </h1>

        <div className="w-full max-w-md flex mt-8 mb-8">
          <div className="w-1/2 relative mr-4" ref={curveRef}>
            <svg viewBox="0 0 100 300" className="w-full h-full">
              <path
                d="M50,0 C30,60 70,120 50,180 C30,240 70,300 50,300"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="20%" stopColor="#FBBF24" />
                  <stop offset="40%" stopColor="#34D399" />
                  <stop offset="60%" stopColor="#8B5CF6" />
                  <stop offset="80%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full w-10 h-10"
                    style={{
                      left: "50%",
                      top: `${(index / 5) * 100}%`,
                    }}
                  />
                ))
              : phases.map((phase, index) => {
                  const Icon = iconMap[phase.icon as keyof typeof iconMap];
                  return (
                    <button
                      key={phase.time}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full p-2 ${
                        phase.color
                      } ${
                        selectedPhase === phase
                          ? "ring-2 ring-offset-2 ring-gray-600"
                          : ""
                      }`}
                      style={{
                        left: "50%",
                        top: `${(index / (phases.length - 1)) * 100}%`,
                      }}
                      onClick={() => setSelectedPhase(phase)}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </button>
                  );
                })}
          </div>

          <div className="w-2/3 relative">
            {isLoading ? (
              <Skeleton className="w-full h-40" />
            ) : (
              selectedPhase && (
                <div
                  ref={cardRef}
                  className="absolute transition-all duration-300 ease-in-out"
                  style={{ top: `${cardPosition}px` }}
                >
                  <Card className={`border-2 ${selectedPhase.borderColor}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {React.createElement(
                          iconMap[selectedPhase.icon as keyof typeof iconMap],
                          {
                            className: `w-6 h-6 ${selectedPhase.textColor}`,
                          }
                        )}
                        <h2
                          className={`text-xl font-semibold ml-2 ${selectedPhase.textColor}`}
                        >
                          {selectedPhase.title}
                        </h2>
                      </div>
                      <span className="text-sm text-gray-500 block mb-2">
                        {selectedPhase.time}
                      </span>
                      <p className="text-sm text-gray-600 mb-4">
                        {selectedPhase.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
          <button className="flex flex-col items-center">
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </button>
          <button className="flex flex-col items-center">
            <Moon className="w-6 h-6 text-purple-600" />
            <span className="text-xs text-purple-600">Sleep</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center -mt-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </button>
          <button className="flex flex-col items-center">
            <Activity className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Activity</span>
          </button>
          <button className="flex flex-col items-center">
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Rhythm;
