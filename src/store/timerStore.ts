import { create } from 'zustand';
import { logSession } from '../lib/db';

export type SessionType = 'work' | 'shortBreak' | 'longBreak';

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

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  skip: () => void;
  setSessionType: (type: SessionType) => void;
  setWorkDuration: (minutes: number) => void;
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

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => {
    const { sessionType, workDuration, shortBreakDuration, longBreakDuration } = get();
    const duration = sessionType === 'work' ? workDuration : sessionType === 'shortBreak' ? shortBreakDuration : longBreakDuration;
    set({ isRunning: false, timeLeft: duration });
  },
  
  tick: () => {
    const state = get();
    if (!state.isRunning) return;
    
    if (state.timeLeft > 0) {
      set({ timeLeft: state.timeLeft - 1 });
    } else {
      // Play sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
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

      // Log session
      const duration = state.sessionType === 'work' ? state.workDuration : 
                       state.sessionType === 'shortBreak' ? state.shortBreakDuration : 
                       state.longBreakDuration;
      logSession(state.sessionType, duration);

      // Time is up, transition to next session
      state.skip();
    }
  },
  
  skip: () => {
    const state = get();
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
    
    const duration = nextType === 'work' ? state.workDuration : nextType === 'shortBreak' ? state.shortBreakDuration : state.longBreakDuration;
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
    const duration = type === 'work' ? state.workDuration : type === 'shortBreak' ? state.shortBreakDuration : state.longBreakDuration;
    set({ sessionType: type, timeLeft: duration, isRunning: false });
  },

  setWorkDuration: (minutes) => {
    const seconds = minutes * 60;
    set({ workDuration: seconds });
    if (get().sessionType === 'work') {
      set({ timeLeft: seconds });
    }
  }
}));
