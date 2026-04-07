import { SRCard, ProgressState } from "./types";

export function createCard(questionId: string): SRCard {
  return {
    questionId,
    interval: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString().split("T")[0],
    repetitions: 0,
  };
}

export function reviewCard(card: SRCard, quality: number): SRCard {
  let { interval, easeFactor, repetitions } = card;
  if (quality < 3) {
    repetitions = 0;
    interval = 0;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  const nextReview = new Date(Date.now() + interval * 86400000)
    .toISOString()
    .split("T")[0];
  return { ...card, interval, easeFactor, nextReview, repetitions };
}

export function getDueCards(state: ProgressState): SRCard[] {
  const today = new Date().toISOString().split("T")[0];
  return Object.values(state.srState).filter((card) => card.nextReview <= today);
}

export function updateSRState(
  state: ProgressState,
  questionId: string,
  quality: number
): ProgressState {
  const existing = state.srState[questionId] || createCard(questionId);
  const updated = reviewCard(existing, quality);
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const streak =
    state.lastActiveDate === today
      ? state.streak
      : state.lastActiveDate === yesterday
        ? state.streak + 1
        : 1;
  return {
    ...state,
    srState: { ...state.srState, [questionId]: updated },
    lastActiveDate: today,
    streak,
  };
}
