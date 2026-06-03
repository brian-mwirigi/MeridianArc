import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  label?: string; // e.g. CS, Math, Research
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string, label?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (title, label) => set((state) => ({
    tasks: [...state.tasks, {
      id: crypto.randomUUID(),
      title,
      completed: false,
      label
    }]
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  clearCompleted: () => set((state) => ({
    tasks: state.tasks.filter(t => !t.completed)
  })),
}));
