import { EMPTY_FEEDBACK, type ConversationStore } from './conversation-store';

// Row components subscribe to a single message / feedback entry so that an
// update to one message re-renders one row, not the whole timeline.
export const selectMessage = (id: string) => (state: ConversationStore) =>
  state.messagesById[id];

export const selectFeedback = (id: string) => (state: ConversationStore) =>
  state.feedbackById[id] ?? EMPTY_FEEDBACK;

export const selectReplyTarget = (state: ConversationStore) =>
  state.replyToId ? state.messagesById[state.replyToId] : undefined;
