import { useTimerStore } from '../store/timerStore';

export function Header() {
  const { pomodorosCompleted, pomodorosUntilLongBreak, sessionType, isRunning } = useTimerStore();
  const cycle = pomodorosCompleted % pomodorosUntilLongBreak;
  const now = new Date();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  const statusColor = isRunning
    ? sessionType === 'work' ? 'text-hot neon-hot' : 'text-neon neon'
    : 'text-dim';

  return (
    <header className="w-full border-b border-edge pb-3 flex items-center justify-between">
      {/* Left - brand + date */}
      <div className="flex items-center gap-4">
        <span className="text-neon neon font-bold text-sm tracking-tight">MERIDIAN</span>
        <span className="text-dim text-[10px] tracking-[0.15em]">///</span>
        <span className="text-[10px] text-dim tracking-[0.15em]">{dateStr}</span>
      </div>

      {/* Center - cycle progress */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-dim uppercase tracking-widest mr-1">CYCLE</span>
        {Array.from({ length: pomodorosUntilLongBreak }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-[3px] ${
              i < cycle ? 'bg-neon shadow-[0_0_4px_rgba(0,255,159,0.5)]' : 'bg-edge'
            } transition-all duration-300`}
          />
        ))}
        <span className="text-[9px] text-dim ml-1 tabular-nums">{cycle}/{pomodorosUntilLongBreak}</span>
      </div>

      {/* Right - time + status */}
      <div className="flex items-center gap-3 text-[10px]">
        <span className="text-dim tabular-nums tracking-wider">{time}</span>
        <span className="text-edge">|</span>
        <span className={statusColor}>
          {isRunning ? (sessionType === 'work' ? '● REC' : '● BRK') : '○ IDLE'}
        </span>
      </div>
    </header>
  );
}
