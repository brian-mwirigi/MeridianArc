import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';

export function TaskManager() {
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted } = useTaskStore();
  const [input, setInput] = useState('');
  const [label, setLabel] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addTask(input.trim(), label.trim() || undefined);
    setInput('');
    setLabel('');
  };

  const done = tasks.filter(t => t.completed).length;

  return (
    <div className="w-full border border-edge bg-surface">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
          <span className="text-muted">TASKS</span>
          {tasks.length > 0 && (
            <span className="text-dim tabular-nums">[{done}/{tasks.length}]</span>
          )}
        </div>
        {done > 0 && (
          <button
            onClick={clearCompleted}
            className="text-[9px] uppercase tracking-[0.15em] text-dim hover:text-hot transition-colors"
          >
            PURGE DONE
          </button>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleAdd} className="flex border-b border-edge">
        <span className="text-neon text-xs px-3 py-3 border-r border-edge select-none">›</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="add task..."
          className="flex-1 bg-transparent text-white text-xs px-3 py-3 outline-none placeholder:text-dim"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="tag"
          className="w-16 bg-transparent text-dim text-[10px] px-2 py-3 outline-none border-l border-edge placeholder:text-edge uppercase tracking-widest text-center"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="text-[10px] px-4 py-3 border-l border-edge text-dim hover:text-neon hover:bg-panel disabled:opacity-20 transition-colors uppercase tracking-widest"
        >
          ADD
        </button>
      </form>

      {/* Task list */}
      <div className="max-h-[220px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="px-4 py-8 text-center text-[10px] text-dim uppercase tracking-widest">
            — NO TASKS —
          </div>
        ) : (
          tasks.map((task, i) => (
            <div
              key={task.id}
              className={`flex items-center border-b border-edge last:border-b-0 group ${
                task.completed ? 'opacity-40' : ''
              }`}
            >
              {/* Index */}
              <span className="text-[9px] text-edge w-8 text-center tabular-nums py-3 select-none">
                {(i + 1).toString().padStart(2, '0')}
              </span>

              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-8 text-center py-3 transition-colors ${
                  task.completed ? 'text-neon' : 'text-edge hover:text-muted'
                }`}
              >
                {task.completed ? '[×]' : '[ ]'}
              </button>

              {/* Title */}
              <span className={`flex-1 text-xs py-3 truncate ${
                task.completed ? 'text-dim line-through' : 'text-muted'
              }`}>
                {task.title}
              </span>

              {/* Label */}
              {task.label && (
                <span className="text-[9px] text-dim px-2 py-1 border border-edge mr-2 uppercase tracking-widest">
                  {task.label}
                </span>
              )}

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-[9px] px-3 py-3 text-transparent group-hover:text-dim hover:!text-hot transition-colors"
              >
                DEL
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
