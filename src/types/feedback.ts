export type FeedbackRating = 'like' | 'dislike';

export const FEEDBACK_REASONS = [
  { id: 'inaccurate', label: 'Inaccurate' },
  { id: 'too_generic', label: 'Too Generic' },
  { id: 'didnt_help', label: "Didn't Help" },
  { id: 'too_long', label: 'Too Long' },
] as const;

export type FeedbackReason = (typeof FEEDBACK_REASONS)[number]['id'];

export interface MessageFeedback {
  rating: FeedbackRating | null;
  reasons: FeedbackReason[];
}
