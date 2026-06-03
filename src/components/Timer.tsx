import { useEffect } from 'react';
import { useTimerStore, SessionType } from '../store/timerStore';

const LABELS: Record<SessionType, string> = {
  work: 'FOCUS',
  shortBreak: 'SHORT BREAK',
  longBreak: 'LONG BREAK',
  stopwatch: 'STOPWATCH',
};

const COLORS: Record<SessionType, { text: string; glow: string; bar: string }> = {
  work: { text: 'text-hot', glow: 'neon-hot', bar: 'bg-hot shadow-[0_0_8px_rgba(255,62,62,0.4)]' },
  shortBreak: { text: 'text-neon', glow: 'neon', bar: 'bg-neon shadow-[0_0_8px_rgba(0,255,159,0.4)]' },
  longBreak: { text: 'text-amber', glow: 'neon-amber', bar: 'bg-amber shadow-[0_0_8px_rgba(255,184,0,0.4)]' },
  stopwatch: { text: 'text-white', glow: 'neon', bar: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' },
};

export function Timer() {
  const {
    timeLeft, isRunning, sessionType, pomodorosCompleted,
    start, pause, reset, skip, tick, setSessionType,
  } = useTimerStore();

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  // Progress
  const state = useTimerStore.getState();
  const total = sessionType === 'work' ? state.workDuration
    : sessionType === 'shortBreak' ? state.shortBreakDuration
    : state.longBreakDuration;
  const elapsed = total - timeLeft;
  const pct = (elapsed / total) * 100;

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const c = COLORS[sessionType];

  const tabs: { key: SessionType; label: string; shortcut: string }[] = [
    { key: 'work', label: 'FOCUS', shortcut: '1' },
    { key: 'shortBreak', label: 'SHORT', shortcut: '2' },
    { key: 'longBreak', label: 'LONG', shortcut: '3' },
    { key: 'stopwatch', label: 'STOPWATCH', shortcut: '4' },
  ];

  return (
    <div className="w-full">
      {/* Mode tabs */}
      <div className="flex border border-edge mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSessionType(t.key)}
            className={`flex-1 py-2.5 text-[10px] uppercase tracking-[0.2em] border-r last:border-r-0 border-edge transition-colors ${
              sessionType === t.key
                ? 'bg-surface text-white'
                : 'bg-transparent text-dim hover:text-muted hover:bg-surface/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="flex flex-col items-center mb-8">
        <div className="text-[9px] text-dim uppercase tracking-[0.3em] mb-4">
          {LABELS[sessionType]} — #{pomodorosCompleted + 1}
        </div>

        {/* The clock */}
        <div className="relative mb-6">
          <div className={`text-[5rem] sm:text-[6rem] md:text-[8rem] leading-none tabular-nums font-light tracking-tight ${c.text} ${isRunning ? c.glow : ''} transition-all`}>
            {mins}
            <span className={`${isRunning ? 'breathe' : 'opacity-40'}`}>:</span>
            {secs}
          </div>
        </div>

        {/* Progress bar - full width, brutal */}
        <div className="w-full h-1 bg-edge relative overflow-hidden">
          {sessionType !== 'stopwatch' && (
            <div
              className={`h-full ${c.bar} transition-all duration-1000 ease-linear`}
              style={{ width: `${pct}%` }}
            />
          )}
        </div>

        {/* Labels below bar */}
        <div className="flex justify-between mt-3 text-[9px] text-dim uppercase tracking-widest font-mono">
          <span>
            {sessionType === 'stopwatch' 
              ? 'COUNTING UP' 
              : `${Math.floor(elapsed / 60)}m elapsed`}
          </span>
          <span>
            {sessionType === 'stopwatch'
              ? '∞'
              : `${Math.ceil(timeLeft / 60)}m remaining`}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={isRunning ? pause : start}
          className={`flex-1 py-3.5 text-[11px] uppercase tracking-[0.25em] font-semibold border transition-all ${
            isRunning
              ? 'border-edge bg-surface text-white hover:bg-edge'
              : `border-neon bg-neon text-void hover:shadow-[0_0_20px_rgba(0,255,159,0.3)]`
          }`}
        >
          {isRunning ? '|| PAUSE' : '▶ START'}
        </button>
        <button onClick={reset} className="text-[10px] uppercase tracking-widest px-4 border border-edge text-dim hover:text-white hover:bg-surface transition-colors">
          RESET
        </button>
        <button onClick={skip} className="text-[10px] uppercase tracking-widest px-4 border border-edge text-dim hover:text-white hover:bg-surface transition-colors">
          SKIP »
        </button>
      </div>
    </div>
  );
}
