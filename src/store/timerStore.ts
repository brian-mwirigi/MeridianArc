import { create } from 'zustand';
import { logSession } from '../lib/db';

export type SessionType = 'work' | 'shortBreak' | 'longBreak' | 'stopwatch';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  sessionType: SessionType;
  pomodorosCompleted: number;
  
  // Settings
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  tickSoundEnabled: boolean;
  volume: number;

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  skip: () => void;
  setSessionType: (type: SessionType) => void;
  setWorkDuration: (minutes: number) => void;
  setTickSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

const DEFAULT_WORK = 25 * 60;
const DEFAULT_SHORT_BREAK = 5 * 60;
const DEFAULT_LONG_BREAK = 15 * 60;

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: DEFAULT_WORK,
  isRunning: false,
  sessionType: 'work',
  pomodorosCompleted: 0,
  
  workDuration: DEFAULT_WORK,
  shortBreakDuration: DEFAULT_SHORT_BREAK,
  longBreakDuration: DEFAULT_LONG_BREAK,
  pomodorosUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  tickSoundEnabled: false,
  volume: 0.5,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => {
    const { sessionType, workDuration, shortBreakDuration, longBreakDuration } = get();
    const duration = sessionType === 'work' ? workDuration : sessionType === 'shortBreak' ? shortBreakDuration : sessionType === 'longBreak' ? longBreakDuration : 0;
    set({ isRunning: false, timeLeft: duration });
  },
  
  tick: () => {
    const state = get();
    if (!state.isRunning) return;
    
    if (state.sessionType === 'stopwatch') {
      set({ timeLeft: state.timeLeft + 1 });
      return;
    }

    if (state.timeLeft > 0) {
      set({ timeLeft: state.timeLeft - 1 });
      
      // Tick sound
      if (state.tickSoundEnabled && state.timeLeft > 0) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
          gain.gain.setValueAtTime(state.volume * 0.1, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.05);
        } catch(e) {}
      }
    } else {
      // Play completion chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playNote = (freq: number, startTime: number) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
          gain.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
          gain.gain.linearRampToValueAtTime(state.volume, audioCtx.currentTime + startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + 0.8);
          osc.start(audioCtx.currentTime + startTime);
          osc.stop(audioCtx.currentTime + startTime + 1);
        };

        playNote(880, 0); // A5
        playNote(1108.73, 0.15); // C#6
      } catch (e) {
        console.error("Audio playback failed", e);
      }

      // Show notification
      if (Notification.permission === "granted") {
        new Notification("Meridian Pomodoro", {
          body: `${state.sessionType === 'work' ? 'Focus session' : 'Break'} complete!`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }

      // Time is up, transition to next session
      state.skip();
    }
  },
  
  skip: () => {
    const state = get();
    
    // Log elapsed time for the current session before skipping
    if (state.sessionType !== 'stopwatch') {
      const fullDuration = state.sessionType === 'work' ? state.workDuration : 
                           state.sessionType === 'shortBreak' ? state.shortBreakDuration : 
                           state.longBreakDuration;
      const elapsed = fullDuration - state.timeLeft;
      if (elapsed > 0) {
        logSession(state.sessionType, elapsed);
      }
    }

    let nextType: SessionType = 'work';
    let nextCompleted = state.pomodorosCompleted;
    
    if (state.sessionType === 'work') {
      nextCompleted++;
      if (nextCompleted % state.pomodorosUntilLongBreak === 0) {
        nextType = 'longBreak';
      } else {
        nextType = 'shortBreak';
      }
    }
    
    const duration = nextType === 'work' ? state.workDuration : nextType === 'shortBreak' ? state.shortBreakDuration : nextType === 'longBreak' ? state.longBreakDuration : 0;
    const autoStart = nextType === 'work' ? state.autoStartPomodoros : state.autoStartBreaks;
    
    set({
      sessionType: nextType,
      timeLeft: duration,
      isRunning: autoStart,
      pomodorosCompleted: nextCompleted,
    });
  },

  setSessionType: (type) => {
    const state = get();
    const duration = type === 'work' ? state.workDuration : type === 'shortBreak' ? state.shortBreakDuration : type === 'longBreak' ? state.longBreakDuration : 0;
    set({ sessionType: type, timeLeft: duration, isRunning: false });
  },

  setWorkDuration: (minutes) => {
    const seconds = minutes * 60;
    set({ workDuration: seconds });
    if (get().sessionType === 'work') {
      set({ timeLeft: seconds });
    }
  },

  setTickSoundEnabled: (enabled) => set({ tickSoundEnabled: enabled }),
  setVolume: (volume) => set({ volume }),
}));
