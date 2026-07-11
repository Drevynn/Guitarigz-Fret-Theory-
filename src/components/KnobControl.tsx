import React, { useRef, useEffect, useState } from 'react';

interface KnobControlProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  key?: string | number;
}

export default function KnobControl({
  value,
  min,
  max,
  onChange,
  label,
  unit = '',
  size = 'md',
  disabled = false,
}: KnobControlProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(0);

  // Knob sizes
  const sizes = {
    sm: { dialSize: 36, strokeWidth: 3, fontSize: 'text-[9px]' },
    md: { dialSize: 52, strokeWidth: 4, fontSize: 'text-[10px]' },
    lg: { dialSize: 64, strokeWidth: 5, fontSize: 'text-xs' },
  };

  const { dialSize, strokeWidth, fontSize } = sizes[size];
  const radius = (dialSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Map value to angle: -135deg (min) to +135deg (max)
  const range = max - min;
  const percent = range === 0 ? 0 : (value - min) / range;
  const rotationAngle = -135 + percent * 270;

  // SVG dash array for active track
  const strokeDashoffset = circumference - percent * circumference * (270 / 360);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const deltaY = startYRef.current - e.clientY; // drag up is positive
    const sensitivity = 0.5; // adjust responsiveness
    const deltaVal = (deltaY * sensitivity * range) / 100;
    let newVal = startValRef.current + deltaVal;
    newVal = Math.max(min, Math.min(max, newVal));
    // Round to 1 decimal place or whole number depending on scale
    const rounded = range < 10 ? Math.round(newVal * 10) / 10 : Math.round(newVal);
    onChange(rounded);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Double click resets to midpoint or min
  const handleDoubleClick = () => {
    if (disabled) return;
    const defaultVal = min + range / 2;
    onChange(range < 10 ? Math.round(defaultVal * 10) / 10 : Math.round(defaultVal));
  };

  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={`flex flex-col items-center select-none text-center ${disabled ? 'opacity-40' : ''}`}>
      {/* Knob label */}
      <span className="text-[10px] font-mono font-bold text-slate-400 mb-1 uppercase tracking-wider truncate max-w-[80px]">
        {label}
      </span>

      {/* The Dial Container */}
      <div
        ref={knobRef}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className={`relative cursor-ns-resize flex items-center justify-center transition-transform duration-100 ${
          isDragging ? 'scale-105' : 'hover:scale-102'
        }`}
        style={{ width: dialSize, height: dialSize }}
        title={`${label}: Double-click to reset`}
      >
        {/* Background Dial SVG Track */}
        <svg
          width={dialSize}
          height={dialSize}
          className="absolute -rotate-90 transform"
          style={{ transform: 'rotate(135deg)' }}
        >
          {/* Base gray background track */}
          <circle
            cx={dialSize / 2}
            cy={dialSize / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b" // slate-800
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - circumference * (270 / 360)}
            strokeLinecap="round"
          />
          {/* Active colored track */}
          <circle
            cx={dialSize / 2}
            cy={dialSize / 2}
            r={radius}
            fill="transparent"
            stroke="#f59e0b" // amber-500
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>

        {/* Physical inner knob element */}
        <div
          className="rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg shadow-black/40"
          style={{
            width: dialSize - strokeWidth * 2 - 2,
            height: dialSize - strokeWidth * 2 - 2,
            transform: `rotate(${rotationAngle}deg)`,
          }}
        >
          {/* The pointer line mark on the knob */}
          <div className="absolute top-1 w-[2px] h-2 bg-amber-400 rounded-full" />
        </div>
      </div>

      {/* Knob numeric value string representation */}
      <span className="text-[10px] font-mono text-amber-500/90 font-bold mt-1.5 min-w-[40px]">
        {value}
        <span className="text-[8px] font-medium text-slate-500 ml-0.5">{unit}</span>
      </span>
    </div>
  );
}
