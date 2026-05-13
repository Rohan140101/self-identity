"use client";
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useState, useEffect } from 'react';
// const WORD_COLORS = ["#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#3b82f6"];
const WORD_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#ef4444", // red
  "#14b8a6", // teal
  "#f97316", // orange
  "#84cc16", // lime
  "#06b6d4", // cyan
  "#d946ef", // fuchsia
  "#0ea5e9", // sky
  "#22c55e", // green
  "#e11d48", // rose
  "#eab308", // yellow
  "#64748b", // slate
  "#a16207", // brown
  "#0d9488", // dark teal
  "#7c3aed", // purple
];

// Function for Calculating CDF
const normalCDF = (x: number) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
};

export const SurvivalCurve = ({ wordsData }: { wordsData: any[] }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const desktopTicks = [0, 500, 1000, 1500, 2000, 2500, 3000];
  const mobileTicks = [0, 1000, 2000, 3000];
  const mobileLineMargins = { top: 20, right: 20, left: 10, bottom: 40 }
  const desktopLineMargins = { top: 20, right: 40, left: 20, bottom: 40 }


  const chartData = Array.from({ length: 31 }, (_, i) => {
    const t = i * 100;
    const dataPoint: any = { time: t };


    wordsData.forEach(word => {
      if (word.error) return;
      if (t === 0) {
        dataPoint[word.word] = 100;
      } else {
        const z = (Math.log(t) - word.lognormal_mu) / word.lognormal_sigma;
        const survival = (1 - normalCDF(z)) * 100;
        dataPoint[word.word] = Number(survival.toFixed(2));
      }
    });
    return dataPoint;
  });
  console.log("Sample Data Point:", chartData[10]);
  console.log("Words being looked for:", wordsData.map(w => w.word));
  return (
    <div className="w-full h-137.5 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl px-0.5 py-4 sm:px-8 sm:py-8 flex flex-col">
      <div className="mb-8 flex flex-wrap gap-6 px-4">
        {wordsData.map((word, idx) => {
          if (word.error) return null;

          return (
            <div key={word.word} className="flex items-center gap-2">
              <div
                className="h-1.5 w-6 rounded-full"
                style={{ backgroundColor: WORD_COLORS[idx % WORD_COLORS.length] }}
              />
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                {word.word} {word.unique_users ? `` : ''}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={isMobile ? mobileLineMargins : desktopLineMargins}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="time"
              type="number"
              domain={[0, 3000]}
              ticks={isMobile ? mobileTicks : desktopTicks}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: isMobile ? 11 : 12, fontWeight: 700 }}
              label={{ value: 'Days since creation', position: 'bottom', offset: 20, fill: '#64748b', fontWeight: 800, fontSize: isMobile ? 11 : 12 }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: isMobile ? 11 : 12, fontWeight: 700 }}
              tickFormatter={(val) => `${val}%`}
              label={{ value: 'Persistence Probability', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontWeight: 800, fontSize: isMobile ? 11 : 12 } }}
            />

            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value: any) => [`${value}%`, "Probability"]}
            />

            <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="5 5" />

            {wordsData.map((word, idx) => {
              if (word.error) return null;
              return (
                <Line
                  key={word.word}
                  type="monotone"
                  dataKey={word.word}
                  stroke={WORD_COLORS[idx % WORD_COLORS.length]}
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};