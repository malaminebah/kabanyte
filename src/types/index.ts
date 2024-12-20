import { User } from "@/data/users";

export const LABELS = {
  FRONT: { id: 'front', text: 'Frontend', color: 'bg-sky-400 dark:bg-sky-500' },
  BACK: { id: 'back', text: 'Backend', color: 'bg-emerald-400 dark:bg-emerald-500' },
  BUG: { id: 'bug', text: 'Bug', color: 'bg-rose-400 dark:bg-rose-500' },
  FEATURE: { id: 'feature', text: 'Feature', color: 'bg-violet-400 dark:bg-violet-500' },
  UI: { id: 'ui', text: 'UI/UX', color: 'bg-amber-400 dark:bg-amber-500' },
} as const;

export type LabelType = keyof typeof LABELS;

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export type Card = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  labels: LabelType[];
  attachments: Attachment[];
  assignees: User[];
};

export type Column = {
  id: string;
  title: string;
  boardId: string;
}; 