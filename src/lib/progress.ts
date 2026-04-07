import { ProgressState } from "./types";

const STORAGE_KEY = "java-prep-progress";

const DEFAULT_STATE: ProgressState = {
  completed: [],
  srState: {},
  lastVisited: null,
  streak: 0,
  lastActiveDate: "",
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function toggleComplete(state: ProgressState, topicId: string): ProgressState {
  const completed = state.completed.includes(topicId)
    ? state.completed.filter((id) => id !== topicId)
    : [...state.completed, topicId];
  return updateStreak({ ...state, completed });
}

export function updateLastVisited(state: ProgressState, topicId: string): ProgressState {
  return { ...state, lastVisited: topicId };
}

function updateStreak(state: ProgressState): ProgressState {
  const today = new Date().toISOString().split("T")[0];
  if (state.lastActiveDate === today) return state;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const streak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  return { ...state, streak, lastActiveDate: today };
}
