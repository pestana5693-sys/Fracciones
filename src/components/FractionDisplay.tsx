import React from 'react';
import { Fraction } from '../types';

interface FractionDisplayProps {
  fraction: Fraction;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showVisual?: boolean;
  visualType?: 'circle' | 'bar';
  colorClass?: string;
  className?: string;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  fraction,
  size = 'md',
  showVisual = false,
  visualType = 'circle',
  colorClass = 'bg-blue-500 text-blue-500',
  className = '',
}) => {
  const { numerator, denominator } = fraction;

  const sizeClasses = {
    sm: { text: 'text-sm font-semibold', numDen: 'px-1 py-0.5', line: 'border-b-2' },
    md: { text: 'text-lg font-bold', numDen: 'px-2 py-0.5', line: 'border-b-2' },
    lg: { text: 'text-2xl font-extrabold', numDen: 'px-3 py-1', line: 'border-b-3' },
    xl: { text: 'text-4xl font-extrabold', numDen: 'px-4 py-1.5', line: 'border-b-4' },
  };

  const currSize = sizeClasses[size];

  // Visual Pie Chart or Rectangular Bar
  const renderVisual = () => {
    if (!showVisual || denominator <= 0) return null;

    if (visualType === 'bar') {
      const parts = Math.min(denominator, 16);
      const filledCount = Math.min(numerator, parts);

      return (
        <div className="flex flex-col items-center mt-3">
          <div className="flex border-2 border-slate-700 rounded-lg overflow-hidden h-10 w-full max-w-[240px] bg-slate-100 shadow-inner">
            {Array.from({ length: parts }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 border-r border-slate-300 last:border-r-0 transition-all duration-300 ${
                  i < filledCount ? colorClass : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 mt-1 font-medium">
            {numerator} de {denominator} partes sombreadas
          </span>
        </div>
      );
    }

    // Circle / Pie visual
    const parts = Math.min(denominator, 12);
    const filled = Math.min(numerator, parts);
    const radius = 36;
    const center = 40;

    return (
      <div className="flex flex-col items-center mt-3">
        <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-sm">
          {/* Base circle background */}
          <circle cx={center} cy={center} r={radius} fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
          
          {/* Slices */}
          {Array.from({ length: parts }).map((_, i) => {
            const startAngle = (i * 360) / parts - 90;
            const endAngle = ((i + 1) * 360) / parts - 90;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            const largeArcFlag = 360 / parts > 180 ? 1 : 0;
            const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const isFilled = i < filled;

            return (
              <path
                key={i}
                d={pathData}
                fill={isFilled ? '#3b82f6' : '#f8fafc'}
                stroke="#334155"
                strokeWidth="1.5"
                className="transition-colors duration-300"
              />
            );
          })}
        </svg>
        <span className="text-xs text-slate-500 mt-1 font-medium">
          {numerator} de {denominator} partes
        </span>
      </div>
    );
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className={`inline-flex flex-col items-center justify-center font-mono ${currSize.text}`}>
        <span className={`${currSize.numDen} border-b-2 border-slate-700 text-slate-800 text-center w-full`}>
          {numerator}
        </span>
        <span className={`${currSize.numDen} text-slate-800 text-center w-full`}>
          {denominator}
        </span>
      </div>
      {renderVisual()}
    </div>
  );
};
