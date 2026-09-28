import { useStore } from 'zustand';
import { createStore, type StoreApi } from 'zustand/vanilla';

import {
  mockConversationApi,
  type ConversationApi,
} from "@/api/conversation-api";
import type {
  FeedbackRating,
  FeedbackReason,
  MessageFeedback,
} from "@/types/feedback";
import type { Message, UserMessage } from "@/types/message";
import { createId } from "@/utils/id";

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ConversationState {
  status: LoadStatus;
  error: string | null;
  /** Normalized by id so a single message can change without copying the list. */
  messagesById: Record<string, Message>;
  /** Chronological order (oldest first). */
  messageIds: string[];
  feedbackById: Record<string, MessageFeedback>;
  replyToId: string | null;
  isAssistantTyping: boolean;
}

export interface ConversationActions {
  loadConversation(): Promise<void>;
  sendMessage(text: string): Promise<void>;
  retryMessage(id: string): Promise<void>;
  deleteMessage(id: string): void;
  setReplyTo(id: string | null): void;
  setRating(id: string, rating: FeedbackRating): void;
  toggleFeedbackReason(id: string, reason: FeedbackReason): void;
}

export type ConversationStore = ConversationState & ConversationActions;

export const EMPTY_FEEDBACK: MessageFeedback = { rating: null, reasons: [] };

const initialState: ConversationState = {
  status: 'idle',
  error: null,
  messagesById: {},
  messageIds: [],
  feedbackById: {},
  replyToId: null,
  isAssistantTyping: false,
};

interface Dependencies {
  api: ConversationApi;
  now?: () => Date;
}

export function createConversationStore({
  api,
  now = () => new Date(),
}: Dependencies): StoreApi<ConversationStore> {
  return createStore<ConversationStore>()((set, get) => {
    const patchMessage = (id: string, patch: Partial<Message>) =>
      set(state => {
        const current = state.messagesById[id];
        // The message may have been deleted while a request was in flight.
        if (!current) {
          return state;
        }
        return {
          messagesById: {
            ...state.messagesById,
            [id]: { ...current, ...patch } as Message,
          },
        };
      });

    const appendMessage = (message: Message) =>
      set(state => ({
        messagesById: { ...state.messagesById, [message.id]: message },
        messageIds: [...state.messageIds, message.id],
      }));

    /** Delivers an already-inserted user message and fetches the AI reply. */
    const deliver = async (message: UserMessage) => {
      const input = {
        clientId: message.id,
        text: message.text,
        replyToId: message.replyToId,
      };

      try {
        // The client id stays the list key, so the row is not re-mounted
        // when the server acknowledges it.
        await api.sendMessage(input);
        patchMessage(message.id, { status: 'sent' });
      } catch {
        patchMessage(message.id, { status: 'failed' });
        return;
      }

      set({ isAssistantTyping: true });
      try {
        appendMessage(await api.fetchAssistantReply(input));
      } catch {
        // A failed reply leaves the user's message as sent; the user can ask again.
      } finally {
        set({ isAssistantTyping: false });
      }
    };

    return {
      ...initialState,

      async loadConversation() {
        set({ status: 'loading', error: null });
        try {
          const messages = await api.fetchConversation();
          set({
            status: 'ready',
            messagesById: Object.fromEntries(messages.map(m => [m.id, m])),
            messageIds: messages.map(m => m.id),
            feedbackById: {},
            replyToId: null,
          });
        } catch (error) {
          set({
            status: 'error',
            error:
              error instanceof Error
                ? error.message
                : 'Unable to load conversation.',
          });
        }
      },

      async sendMessage(rawText) {
        const text = rawText.trim();
        if (!text) {
          return;
        }

        const message: UserMessage = {
          id: createId(),
          type: 'user',
          text,
          status: 'sending',
          createdAt: now().toISOString(),
          replyToId: get().replyToId ?? undefined,
        };

        // Optimistic insert: the message shows up before the network round trip.
        appendMessage(message);
        set({ replyToId: null });
        await deliver(message);
      },

      async retryMessage(id) {
        const message = get().messagesById[id];
        if (message?.type !== 'user' || message.status !== 'failed') {
          return;
        }
        patchMessage(id, { status: 'sending' });
        await deliver({ ...message, status: 'sending' });
      },

      deleteMessage(id) {
        set(state => {
          if (!state.messagesById[id]) {
            return state;
          }
          const messagesById = { ...state.messagesById };
          const feedbackById = { ...state.feedbackById };
          delete messagesById[id];
          delete feedbackById[id];
          return {
            messagesById,
            feedbackById,
            messageIds: state.messageIds.filter(messageId => messageId !== id),
            replyToId: state.replyToId === id ? null : state.replyToId,
          };
        });
      },

      setReplyTo(id) {
        set({ replyToId: id });
      },

      setRating(id, rating) {
        set(state => {
          const current = state.feedbackById[id] ?? EMPTY_FEEDBACK;
          // Tapping the active rating again clears it; reasons only apply to dislikes.
          const nextRating = current.rating === rating ? null : rating;
          return {
            feedbackById: {
              ...state.feedbackById,
              [id]: {
                rating: nextRating,
                reasons: nextRating === 'dislike' ? current.reasons : [],
              },
            },
          };
        });
      },

      toggleFeedbackReason(id, reason) {
        set(state => {
          const current = state.feedbackById[id] ?? EMPTY_FEEDBACK;
          const reasons = current.reasons.includes(reason)
            ? current.reasons.filter(r => r !== reason)
            : [...current.reasons, reason];
          return {
            feedbackById: {
              ...state.feedbackById,
              [id]: { rating: 'dislike', reasons },
            },
          };
        });
      },
    };
  });
}

export const conversationStore = createConversationStore({
  api: mockConversationApi,
});

export function useConversationStore<T>(
  selector: (state: ConversationStore) => T,
): T {
  return useStore(conversationStore, selector);
}
