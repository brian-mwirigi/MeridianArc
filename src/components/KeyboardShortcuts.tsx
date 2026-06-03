import { useEffect, useCallback } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useState } from 'react';

export function KeyboardShortcuts() {
  const { isRunning, start, pause, reset, skip } = useTimerStore();
  const [show, setShow] = useState(false);

  const handler = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    switch (e.code) {
      case 'Space': e.preventDefault(); isRunning ? pause() : start(); break;
      case 'KeyR': if (!e.ctrlKey && !e.metaKey) reset(); break;
      case 'KeyS': if (!e.ctrlKey && !e.metaKey) skip(); break;
      case 'Slash': if (e.shiftKey) setShow(s => !s); break;
      case 'Escape': setShow(false); break;
    }
  }, [isRunning, start, pause, reset, skip]);

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);

  return (
    <>
      <button
        onClick={() => setShow(s => !s)}
        className="fixed bottom-5 left-5 text-[10px] text-dim hover:text-muted border border-edge px-3 py-2 bg-void hover:bg-surface transition-colors z-50 uppercase tracking-[0.2em]"
      >
        KBD
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={() => setShow(false)}>
          <div className="bg-void border border-edge w-full max-w-xs" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-edge text-[10px] uppercase tracking-[0.2em] text-muted">
              KEYBINDINGS
            </div>
            {[
              ['SPACE', 'Play / Pause'],
              ['R', 'Reset timer'],
              ['S', 'Skip session'],
              ['?', 'Toggle this panel'],
              ['ESC', 'Close panels'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between px-4 py-2.5 border-b border-edge/50 last:border-b-0">
                <span className="text-xs text-muted">{desc}</span>
                <kbd className="text-[10px] text-neon border border-edge px-2 py-0.5 bg-surface">{key}</kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
