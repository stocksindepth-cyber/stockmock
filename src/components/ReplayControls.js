import React from "react";
import { Play, Pause, FastForward, Rewind, SkipForward, Clock } from "lucide-react";

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
  timeString
}) {

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto glass-card border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto backdrop-blur-2xl bg-[#080C16]/90">
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center mr-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
             <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Campaign</span>
             <span className="text-sm font-bold text-white">Day {dayIndex}/{totalDays}</span>
          </div>
          
          <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <Rewind className="w-5 h-5 text-slate-300" />
          </button>
          
          <button 
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white fill-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1 fill-white" />
            )}
          </button>
          
          <button 
            onClick={onNextDay}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors tooltip-trigger relative group"
            title="Skip to Next Day Opening"
          >
            <SkipForward className="w-5 h-5 text-slate-300 group-hover:text-white" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 w-full flex flex-col gap-2 relative">
          <div className="flex justify-between text-xs text-slate-400 font-medium font-mono">
            <span>Start</span>
            <span className="text-white bg-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1 border border-blue-500/20">
              <Clock className="w-3 h-3 text-blue-400" />
              {timeString || "09:15"}
            </span>
            <span>Expiry</span>
          </div>
          
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
            <input 
              type="range"
              min="0"
              max={totalMinutes}
              value={currentMinute}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Progress Bar Fill */}
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full pointer-events-none transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.6)]"
              style={{ width: `${(currentMinute / totalMinutes) * 100}%` }}
            />
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/5 disabled:opacity-50">
          {[1, 5, 10, 60].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
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
  );
}
