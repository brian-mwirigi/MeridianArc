import { useMemo } from 'react';

interface HeatmapProps {
  data: { date: string; count: number }[];
  weeks?: number;
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export function Heatmap({ data, weeks = 13 }: HeatmapProps) {
  const { grid, months } = useMemo(() => {
    const totalDays = weeks * 7;
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (totalDays - 1) - dayOfWeek);

    const cells: { date: string; count: number; dayOfWeek: number; weekIndex: number }[] = [];
    const totalCells = totalDays + dayOfWeek;

    for (let i = 0; i < totalCells; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = data.find((s) => s.date === dateStr);
      cells.push({
        date: dateStr,
        count: entry ? entry.count : 0,
        dayOfWeek: i % 7,
        weekIndex: Math.floor(i / 7),
      });
    }

    // Build week columns
    const weekCols: typeof cells[] = [];
    for (let w = 0; w <= Math.floor((totalCells - 1) / 7); w++) {
      weekCols.push(cells.filter((c) => c.weekIndex === w));
    }

    // Month labels
    const monthLabels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;
    weekCols.forEach((week, wi) => {
      const firstDay = week.find((d) => d.dayOfWeek === 0);
      if (firstDay) {
        const m = new Date(firstDay.date).getMonth();
        if (m !== lastMonth) {
          monthLabels.push({
            label: new Date(firstDay.date).toLocaleDateString('en', { month: 'short' }).toUpperCase(),
            colIndex: wi,
          });
          lastMonth = m;
        }
      }
    });

    return { grid: weekCols, months: monthLabels };
  }, [data, weeks]);

  const color = (n: number) => {
    if (n === 0) return 'bg-edge/40';
    if (n === 1) return 'bg-neon/15';
    if (n <= 3) return 'bg-neon/30';
    if (n <= 5) return 'bg-neon/55';
    return 'bg-neon/80 shadow-[0_0_3px_rgba(0,255,159,0.4)]';
  };

  return (
    <div className="w-full">
      {/* Month labels */}
      <div className="flex ml-[28px] mb-1">
        {grid.map((_, wi) => {
          const monthLabel = months.find((m) => m.colIndex === wi);
          return (
            <div key={wi} className="flex-1 min-w-0">
              {monthLabel && (
                <span className="text-[8px] text-dim uppercase tracking-widest">{monthLabel.label}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-0">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] mr-1 flex-shrink-0 w-[24px]">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-[12px] flex items-center justify-end pr-1">
              <span className="text-[7px] text-edge leading-none">{label}</span>
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex gap-[2px] flex-1 min-w-0">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px] flex-1 min-w-0">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  title={`${cell.date}: ${cell.count} sessions`}
                  className={`w-full h-[12px] ${color(cell.count)} transition-all hover:ring-1 hover:ring-muted cursor-crosshair`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-[3px] mt-2 justify-end">
        <span className="text-[7px] text-edge mr-1">LESS</span>
        {[0, 1, 3, 5, 7].map((n) => (
          <div key={n} className={`w-[10px] h-[10px] ${color(n)}`} />
        ))}
        <span className="text-[7px] text-edge ml-1">MORE</span>
      </div>
    </div>
  );
}
