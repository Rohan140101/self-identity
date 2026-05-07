import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Customized  } from 'recharts';

interface BellCurveProps {
  actual?: number;
  optimized?: number;
}

const mean = 50;
const stdDev = 14;

const getY = (x: number): number => {
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

const GrowthArrow = ({ xAxisMap, actual, optimized }: any) => {
  if (!xAxisMap) return null;

  const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
  const scale = xAxis?.scale;
  if (!scale) return null;

  const x1 = scale(actual);
  const x2 = scale(optimized);
  const arrowY = 180; // adjust to sit mid-chart vertically

  const midX = (x1 + x2) / 2;
  const growth = Math.round(optimized - actual);

  return (
    <g>
      <defs>
        <marker
          id="growthArrow"
          viewBox="0 0 10 10"
          refX="8" refY="5"
          markerWidth="6" markerHeight="6"
          orient="auto"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Arrow line */}
      <line
        x1={x1 + 4}
        y1={arrowY}
        x2={x2 - 4}
        y2={arrowY}
        stroke="#f59e0b"
        strokeWidth={2}
        markerEnd="url(#growthArrow)"
      />

      {/* Label pill */}
      <rect
        x={midX - 22}
        y={arrowY - 20}
        width={44}
        height={16}
        rx={8}
        fill="white"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.08))' }}
      />
      <text
        x={midX}
        y={arrowY - 8}
        textAnchor="middle"
        fill="#d97706"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        +{growth}%
      </text>
    </g>
  );
};

// Happiness Bell Curve in the Identity Report

const HappinessBellCurve = ({ actual = 28, optimized = 62 }: BellCurveProps) => {
  const data = Array.from({ length: 101 }, (_, i) => ({ x: i, y: getY(i) }));
  const maxY = getY(mean);
  const yDomain: [number, number] = [0, maxY * 1.25];

  const CustomLabel = ({ viewBox, color, value }: any) => {
    if (!viewBox) return null;
    const { x, y } = viewBox;

    return (
      <g>
        <rect
          x={x - 22}
          y={y - 35}
          width={44}
          height={24}
          rx={12}
          fill="white"
          style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' }}
        />
        <text
          x={x}
          y={y - 18}
          textAnchor="middle"
          fill={color}
          className="text-[12px] font-bold tracking-tight"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {Math.round(value)}%
        </text>
      </g>
    );
  };

  return (
    <div className="w-full min-h-125 max-w-5xl mx-auto py-3 px-1 sm:p-8 bg-white rounded-4xl border border-slate-100 shadow-xl flex flex-col">

      <div className="flex flex-wrap items-center justify-between mb-8 px-2">
        <div className="flex flex-col sm:flex-row gap-6">
          {[
            { label: 'Population Avg', color: '#94a3b8', type: 'dashed' },
            { label: 'Current Actual', color: '#2791F5', type: 'solid' },
            { label: 'Optimized State', color: '#10b981', type: 'solid' },
          ].map(({ label, color, type }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`h-1 w-5 rounded-full ${type === 'dashed' ? 'border-t-2 border-dashed' : ''}`}
                style={{
                  backgroundColor: type === 'solid' ? color : 'transparent',
                  borderColor: type === 'dashed' ? color : 'transparent'
                }}
              />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 px-2 py-1 sm:px-4 sm:py-1.5 rounded-full border border-emerald-100">
          <span className="text-[9px] sm:text-[12px] font-black text-emerald-600 uppercase tracking-widest">Growth: </span>
          <span className="text-[9px] sm:text-[12px]  font-black text-emerald-700">+{Math.round(optimized - actual)}%</span>
        </div>
      </div>

      <div className="grow h-87.5 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 40, right: 30, left: 30, bottom: 0 }}>
            <defs>
              <linearGradient id="bellGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <XAxis dataKey="x" type="number" domain={[0, 100]} hide />
            <YAxis domain={yDomain} hide />

            <Area
              type="monotone"
              dataKey="y"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#bellGradient)"
              isAnimationActive={false}
            />

            <ReferenceLine
              x={mean}
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6 6"
              label={(props) => <CustomLabel {...props} color="#64748b" value={mean} />}
            />

            <ReferenceLine
              x={actual}
              stroke="#2791F5"
              strokeWidth={3}
              label={(props) => <CustomLabel {...props} color="#2791F5" value={actual} />}
            />

            <ReferenceLine
              x={optimized}
              stroke="#10b981"
              strokeWidth={3}
              label={(props) => <CustomLabel {...props} color="#059669" value={optimized} />}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between px-8 mt-6 border-t border-slate-50 pt-6">
        <div className="text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Lower Range</p>
          <p className="text-xs font-bold text-slate-400">0%</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Population Median</p>
          <p className="text-xs font-bold text-slate-400">50th Percentile</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Peak Range</p>
          <p className="text-xs font-bold text-slate-400">100%</p>
        </div>
      </div>
    </div>
  );
};

export default HappinessBellCurve;