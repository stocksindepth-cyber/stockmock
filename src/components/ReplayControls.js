import React from "react";
import { Play, Pause, Rewind, SkipForward, Clock } from "lucide-react";

export default function ReplayControls({
  isPlaying,
  onTogglePlay,
  speed,
  onSpeedChange,
  currentMinute,
  totalMinutes = 375,
  dayIndex = 1,
  totalDays = 1,
  onSeek,
  onNextDay,
  timeString,
  timeframe = 1,
  onTimeframeChange,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pointer-events-none">
      <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-2xl px-4 py-3 flex flex-col md:flex-row items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto backdrop-blur-2xl bg-[#080C16]/90">

        {/* Transport controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex flex-col items-center justify-center px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 min-w-[64px]">
            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Day</span>
            <span className="text-sm font-bold text-white">{dayIndex}/{totalDays}</span>
          </div>

          <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <Rewind className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white fill-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
            )}
          </button>

          <button
            onClick={onNextDay}
            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors group"
            title="Skip to Next Day"
          >
            <SkipForward className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span className="text-[10px]">Start</span>
            <span className="text-white bg-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1 border border-blue-500/20 text-[11px]">
              <Clock className="w-3 h-3 text-blue-400" />
              {timeString || "09:15"}
            </span>
            <span className="text-[10px]">Expiry</span>
          </div>
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
            <input
              type="range" min="0" max={totalMinutes} value={currentMinute}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              style={{ width: `${(currentMinute / Math.max(totalMinutes, 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Candle</span>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
            {[1, 5, 15].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange?.(tf)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  timeframe === tf
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tf}m
              </button>
            ))}
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Speed</span>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
            {[1, 5, 10, 60].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  speed === s
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
