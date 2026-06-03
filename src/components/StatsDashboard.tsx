import { useEffect, useState } from 'react';
import { getSessionStats } from '../lib/db';
import { Heatmap } from './Heatmap';

export function StatsDashboard() {
  const [stats, setStats] = useState<{ date: string; count: number }[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);

  const loadStats = () => {
    getSessionStats().then((data: any) => {
      setStats(data);
      setTotalSessions(data.reduce((a: number, c: any) => a + c.count, 0));
    });
  };

  useEffect(() => {
    loadStats();
    window.addEventListener('session_logged', loadStats);
    return () => window.removeEventListener('session_logged', loadStats);
  }, []);

  // Streak
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = stats.find((s) => s.date === dateStr);
    if (entry && entry.count > 0) streak++;
    else break;
  }

  const focusHrs = ((totalSessions * 25) / 60).toFixed(1);

  // Best day
  const best = stats.reduce((max, s) => (s.count > max ? s.count : max), 0);

  return (
    <div className="w-full border-t border-edge bg-surface">
      {/* Header */}
      <div className="px-4 py-3 border-b border-edge text-[10px] uppercase tracking-[0.2em] text-muted">
        ANALYTICS
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 border-b border-edge">
        {[
          { val: focusHrs, label: 'HOURS', color: 'text-white' },
          { val: totalSessions, label: 'SESSIONS', color: 'text-white' },
          { val: streak, label: streak > 0 ? 'STREAK 🔥' : 'STREAK', color: streak > 0 ? 'text-amber' : 'text-white' },
          { val: best, label: 'BEST DAY', color: 'text-white' },
        ].map(({ val, label, color }) => (
          <div key={label} className="px-3 py-3 border-r border-edge last:border-r-0">
            <div className={`text-xl tabular-nums font-light ${color}`}>{val}</div>
            <div className="text-[8px] text-dim uppercase tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="p-4">
        <div className="text-[9px] text-dim uppercase tracking-widest mb-3">13 WEEK CONTRIBUTION MAP</div>
        <Heatmap data={stats} weeks={13} />
      </div>
    </div>
  );
}
