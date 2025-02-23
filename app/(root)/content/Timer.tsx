"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimerMode = "work" | "break" | "longBreak";

interface TimerConfig {
  work: number;
  break: number;
  longBreak: number;
}

const TIMER_CONFIG: TimerConfig = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const audio = new Audio("/notification.mp3");
      audio.play();

      if (mode === "work") {
        const newSessionsCompleted = sessionsCompleted + 1;
        setSessionsCompleted(newSessionsCompleted);

        if (newSessionsCompleted % 4 === 0) {
          setMode("longBreak");
          setTimeLeft(TIMER_CONFIG.longBreak);
        } else {
          setMode("break");
          setTimeLeft(TIMER_CONFIG.break);
        }
      } else {
        setMode("work");
        setTimeLeft(TIMER_CONFIG.work);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessionsCompleted]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIG[mode]);
  };

  const changeMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_CONFIG[newMode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="border border-zinc-800 border-dashed rounded-lg space-y-10">
      <div className=" p-3 ">
        <Tabs
          value={mode}
          className="w-full"
          onValueChange={(value) => changeMode(value as TimerMode)}
        >
          <TabsList className="grid grid-cols-3 w-full bg-transparent ">
            <TabsTrigger
              value="work"
              className="py-3 data-[state=active]:bg-transparent data-[state=active]:border border-zinc-800 border-dashed data-[state=active]:text-zinc-50"
            >
              Focus
            </TabsTrigger>
            <TabsTrigger
              value="break"
              className="py-3 data-[state=active]:bg-transparent data-[state=active]:border border-zinc-800 border-dashed data-[state=active]:text-zinc-50"
            >
              Break
            </TabsTrigger>
            <TabsTrigger
              value="longBreak"
              className="py-3 data-[state=active]:bg-transparent data-[state=active]:border border-zinc-800 border-dashed data-[state=active]:text-zinc-50"
            >
              Long Break
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="text-7xl text-center">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
      <div className="flex gap-4 p-3">
        <button
          onClick={toggleTimer}
          className="bg-white text-black rounded-lg w-full flex items-center justify-center p-3"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="bg-transparent w-full flex items-center justify-center p-3 border rounded-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
