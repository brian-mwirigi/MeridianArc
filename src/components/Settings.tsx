import { useTimerStore } from '../store/timerStore';
import { useState } from 'react';

export function Settings() {
  const {
    workDuration, shortBreakDuration, longBreakDuration,
    autoStartPomodoros, autoStartBreaks,
    setWorkDuration,
  } = useTimerStore();

  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 text-[10px] uppercase tracking-[0.2em] text-dim hover:text-muted border border-edge px-3 py-2 bg-void hover:bg-surface transition-colors z-50"
      >
        CFG
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
      <div className="bg-void border border-edge w-full max-w-sm" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-edge">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">CONFIGURATION</span>
          <button onClick={() => setIsOpen(false)} className="text-[10px] text-dim hover:text-white transition-colors">
            [ESC]
          </button>
        </div>

        {/* Durations */}
        <div className="px-4 py-4 border-b border-edge">
          <div className="text-[9px] text-dim uppercase tracking-widest mb-3">DURATIONS (MIN)</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'FOCUS', val: workDuration / 60, editable: true },
              { label: 'SHORT', val: shortBreakDuration / 60, editable: false },
              { label: 'LONG', val: longBreakDuration / 60, editable: false },
            ].map(({ label, val, editable }) => (
              <div key={label}>
                <label className="text-[8px] text-edge uppercase tracking-widest block mb-1">{label}</label>
                <input
                  type="number"
                  value={val}
                  onChange={editable ? (e) => setWorkDuration(Number(e.target.value)) : undefined}
                  readOnly={!editable}
                  className={`w-full text-center py-2.5 border text-xs ${
                    editable
                      ? 'bg-surface text-white border-edge focus:border-muted outline-none'
                      : 'bg-panel text-dim border-edge/50 cursor-not-allowed'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="px-4 py-4">
          <div className="text-[9px] text-dim uppercase tracking-widest mb-3">AUTOMATION</div>
          {[
            { label: 'Auto-start breaks', on: autoStartBreaks },
            { label: 'Auto-start pomodoros', on: autoStartPomodoros },
          ].map(({ label, on }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-edge/50 last:border-b-0">
              <span className="text-xs text-muted">{label}</span>
              <span className={`text-[10px] ${on ? 'text-neon' : 'text-dim'}`}>
                {on ? '[ON]' : '[OFF]'}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-edge text-center">
          <span className="text-[8px] text-edge uppercase tracking-widest">MERIDIAN POMODORO ENGINE v0.1.0</span>
        </div>
      </div>
    </div>
  );
}
