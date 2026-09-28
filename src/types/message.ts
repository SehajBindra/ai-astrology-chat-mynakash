import type { Recommendation } from './recommendation';

export type MessageType = 'user' | 'ai' | 'human' | 'system';

/** Delivery lifecycle of messages sent from this device. */
export type DeliveryStatus = 'sending' | 'sent' | 'failed';

interface MessageBase<T extends MessageType> {
  id: string;
  type: T;
  text: string;
  /** ISO-8601 timestamp. */
  createdAt: string;
  /** Id of the message this one replies to, if any. */
  replyToId?: string;
}

export interface UserMessage extends MessageBase<'user'> {
  status: DeliveryStatus;
}

export interface AiMessage extends MessageBase<'ai'> {
  recommendations?: Recommendation[];
}

export interface Author {
  name: string;
  avatarUrl?: string;
}

export interface HumanMessage extends MessageBase<'human'> {
  author: Author;
}

export type SystemMessage = MessageBase<'system'>;

export type Message = UserMessage | AiMessage | HumanMessage | SystemMessage;
