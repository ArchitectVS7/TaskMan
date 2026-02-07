import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimeEntry } from '../types';

interface TimerState {
  activeEntry: TimeEntry | null;
  isPomodoro: boolean;
  pomodoroSeconds: number; // countdown remaining
  setActiveEntry: (entry: TimeEntry | null) => void;
  clearActiveEntry: () => void;
  startPomodoro: (seconds?: number) => void;
  stopPomodoro: () => void;
  tickPomodoro: () => void;
}

const DEFAULT_POMODORO = 25 * 60; // 25 minutes

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      activeEntry: null,
      isPomodoro: false,
      pomodoroSeconds: DEFAULT_POMODORO,

      setActiveEntry: (entry) => set({ activeEntry: entry }),

      clearActiveEntry: () =>
        set({ activeEntry: null, isPomodoro: false, pomodoroSeconds: DEFAULT_POMODORO }),

      startPomodoro: (seconds = DEFAULT_POMODORO) =>
        set({ isPomodoro: true, pomodoroSeconds: seconds }),

      stopPomodoro: () =>
        set({ isPomodoro: false, pomodoroSeconds: DEFAULT_POMODORO }),

      tickPomodoro: () =>
        set((state) => ({
          pomodoroSeconds: Math.max(0, state.pomodoroSeconds - 1),
        })),
    }),
    {
      name: 'timer-storage',
    }
  )
);
