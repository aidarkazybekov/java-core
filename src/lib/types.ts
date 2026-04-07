export interface TopicContent {
  id: string;
  blockId: number;
  title: string;
  summary: string;
  deepDive: string;
  code: string;
  interviewQs: InterviewQuestion[];
  tip: string;
  springConnection: SpringConnection | null;
}

export interface SpringConnection {
  concept: string;
  springFeature: string;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  q: string;
  a: string;
  difficulty: "junior" | "mid" | "senior";
}

export interface Block {
  id: number;
  icon: string;
  title: string;
  topics: TopicMeta[];
}

export interface TopicMeta {
  id: string;
  title: string;
  prerequisites?: string[];
}

export interface ProgressState {
  completed: string[];
  srState: Record<string, SRCard>;
  lastVisited: string | null;
  streak: number;
  lastActiveDate: string;
}

export interface SRCard {
  questionId: string;
  interval: number;
  easeFactor: number;
  nextReview: string;
  repetitions: number;
}
