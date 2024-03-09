export type NotificationType = 'error' | 'success';
export type Notification = { type: NotificationType, message: string, uuid?: string };

export interface Answer {
  questionId: string;
  agree?: boolean;
  rating?: number;
}
