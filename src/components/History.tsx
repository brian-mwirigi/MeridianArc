import { useEffect, useState } from 'react';
import { getSessionHistory } from '../lib/db';

interface SessionRecord {
  id: number;
  type: string;
  duration: number;
  created_at: string;
}

export function History({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<SessionRecord[]>([]);

  const loadHistory = () => {
    getSessionHistory(100).then((data: any) => {
      setHistory(data);
    });
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('session_logged', loadHistory);
    return () => window.removeEventListener('session_logged', loadHistory);
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return `${m}m`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', 
      hour: '2-digit', minute: '2-digit' 
    }).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-void border border-edge w-full max-w-md h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-edge flex-shrink-0">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">SESSION LOG</span>
          <button onClick={onClose} className="text-[10px] text-dim hover:text-white transition-colors">
            [ESC]
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_2fr_1fr] px-4 py-2 border-b border-edge text-[9px] uppercase tracking-widest text-dim flex-shrink-0">
          <div>TYPE</div>
          <div>TIMESTAMP</div>
          <div className="text-right">DURATION</div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="p-8 text-center text-[10px] text-dim uppercase tracking-widest">
              — NO RECORDS FOUND —
            </div>
          ) : (
            history.map((record) => (
              <div key={record.id} className="grid grid-cols-[1fr_2fr_1fr] px-4 py-3 border-b border-edge/50 last:border-0 hover:bg-surface transition-colors items-center">
                <div className={`text-[10px] uppercase tracking-widest ${
                  record.type === 'work' ? 'text-hot' : 
                  record.type === 'shortBreak' ? 'text-neon' : 'text-amber'
                }`}>
                  {record.type === 'work' ? 'FOCUS' : record.type === 'shortBreak' ? 'SHORT' : 'LONG'}
                </div>
                <div className="text-[10px] text-muted font-mono">{formatDate(record.created_at)}</div>
                <div className="text-[10px] text-white font-mono text-right">{formatDuration(record.duration)}</div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-edge text-center flex-shrink-0">
          <span className="text-[8px] text-edge uppercase tracking-widest">SHOWING LAST {history.length} RECORDS</span>
        </div>
      </div>
    </div>
  );
}
