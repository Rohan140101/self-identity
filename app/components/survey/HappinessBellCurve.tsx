import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BellCurveProps {
  actual?: number;
  predicted?: number;
  optimized?: number;
}

interface DotLabelProps {
  viewBox?: {
    x: number;
    y: number;
    height: number;
  };
  yValue: number;
  color: string;
  yDomain: [number, number];
}

interface LegendItem {
  label: string;
  color: string;
}

const HappinessBellCurve = ({ actual = 28, predicted = 45, optimized = 62 }: BellCurveProps) => {
  const mean = 50;
  const stdDev = 18;

  const getY = (x: number): number => {
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  };

  // Use 0.1 steps so ReferenceLine x values with decimals find a close match
  const data: { x: number; y: number }[] = Array.from({ length: 1001 }, (_, i) => {
    const x = parseFloat((i * 0.1).toFixed(1));
    return { x, y: getY(x) };
  });

  const maxY = getY(mean);
  const yMax = maxY * 1.1;
  const yDomain: [number, number] = [0, yMax];

  const DotLabel = ({ viewBox, yValue, color, yDomain }: DotLabelProps) => {
    if (!viewBox) return null;
    const { x, y, height } = viewBox;
    const [yMin, yMax] = yDomain;
    const fraction = 1 - (yValue - yMin) / (yMax - yMin);
    const cy = y + fraction * height;
    return <circle cx={x} cy={cy} r={6} fill={color} stroke="white" strokeWidth={2} />;
  };

  const legendItems: LegendItem[] = [
    { label: 'Actual', color: '#64748b' },
    { label: 'Predicted', color: '#8b5cf6' },
    { label: 'Optimized', color: '#22c55e' },
  ];

  return (
    <div style={{ width: '100%', padding: '20px 0' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', paddingLeft: '10px' }}>
        {legendItems.map(({ label, color }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#555',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: color,
              }}
            />
            {label}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="bellGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis dataKey="x" hide />
          <YAxis domain={yDomain} hide />

          <Area
            type="monotone"
            dataKey="y"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#bellGradient)"
            dot={false}
            isAnimationActive={false}
          />

          {/* Actual - Slate */}
          <ReferenceLine
            x={Math.round(actual * 10) / 10}
            stroke="#64748b"
            strokeWidth={2}
            strokeDasharray="4 3"
            label={(props) => (
              <DotLabel
                {...props}
                yValue={getY(actual)}
                color="#64748b"
                yDomain={yDomain}
              />
            )}
          />

          {/* Predicted - Purple */}
          <ReferenceLine
            x={Math.round(predicted * 10) / 10}
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="4 3"
            label={(props) => (
              <DotLabel
                {...props}
                yValue={getY(predicted)}
                color="#8b5cf6"
                yDomain={yDomain}
              />
            )}
          />

          {/* Optimized - Green */}
          <ReferenceLine
            x={Math.round(optimized * 10) / 10}
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="4 3"
            label={(props) => (
              <DotLabel
                {...props}
                yValue={getY(optimized)}
                color="#22c55e"
                yDomain={yDomain}
              />
            )}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* X-axis labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '8px',
          color: '#9ca3af',
          fontSize: '11px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        <span>Lower Happiness</span>
        <span>Population Average</span>
        <span>Higher Happiness</span>
      </div>
    </div>
  );
};

export default HappinessBellCurve;