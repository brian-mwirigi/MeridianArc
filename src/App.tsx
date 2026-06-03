import "./App.css";
import { Timer } from "./components/Timer";
import { TaskManager } from "./components/TaskManager";
import { StatsDashboard } from "./components/StatsDashboard";
import { Settings } from "./components/Settings";
import { Header } from "./components/Header";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { useFocusMode } from "./hooks/useFocusMode";

function App() {
  const { focusMode, toggle } = useFocusMode();

  if (focusMode) {
    return (
      <div className="h-screen w-screen bg-void grid-bg scanlines flex items-center justify-center relative">
        <div className="w-full max-w-[440px] px-6">
          <Timer />
        </div>
        <button
          onClick={toggle}
          className="fixed top-5 right-5 text-[10px] uppercase tracking-[0.2em] border text-neon border-neon bg-void hover:bg-surface px-3 py-2 transition-colors z-50"
        >
          ◉ FOCUS
        </button>
        <Settings />
        <KeyboardShortcuts />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-void grid-bg scanlines flex flex-col overflow-hidden relative">
      {/* Top bar */}
      <div className="w-full px-6 pt-5 pb-0 flex-shrink-0">
        <Header />
      </div>

      {/* Main dashboard grid */}
      <div className="flex-1 grid grid-cols-[1fr_380px] gap-0 overflow-hidden min-h-0">
        {/* LEFT — Timer */}
        <div className="flex items-center justify-center border-r border-edge px-8">
          <div className="w-full max-w-[500px]">
            <Timer />
          </div>
        </div>

        {/* RIGHT — Panels stacked */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0">
            <TaskManager />
            <StatsDashboard />
          </div>
        </div>
      </div>

      {/* Focus mode toggle */}
      <button
        onClick={toggle}
        className="fixed top-5 right-5 text-[10px] uppercase tracking-[0.2em] border text-dim border-edge bg-void hover:bg-surface hover:text-muted px-3 py-2 transition-colors z-50"
      >
        ○ FOCUS
      </button>

      <Settings />
      <KeyboardShortcuts />
    </div>
  );
}

export default App;
