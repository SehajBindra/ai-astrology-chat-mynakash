import type { AiMessage, Message } from "@/types/message";
import { randomBetween, wait } from "@/utils/async";
import { createId } from "@/utils/id";
import { buildAssistantReply } from './assistant-replies';
import { createSeedConversation } from './seed';

export interface SendMessageInput {
  clientId: string;
  text: string;
  replyToId?: string;
}

export interface SendMessageResult {
  id: string;
  createdAt: string;
}

/**
 * Contract between the UI/store and the backend. The store only depends on
 * this interface, so swapping the mock for a real HTTP/WebSocket client does
 * not touch any component.
 */
export interface ConversationApi {
  fetchConversation(): Promise<Message[]>;
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
  fetchAssistantReply(input: SendMessageInput): Promise<AiMessage>;
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

/** Demo scenarios, switchable at runtime from the conversation header. */
export type MockScenario = 'default' | 'empty' | 'network_error';

export interface MockApiConfig {
  scenario: MockScenario;
  /** Probability (0–1) that sending a message fails. */
  sendFailureRate: number;
  latencyMs: { min: number; max: number };
}

export const mockApiConfig: MockApiConfig = {
  scenario: 'default',
  sendFailureRate: 0.2,
  latencyMs: { min: 600, max: 1400 },
};

const simulateLatency = () =>
  wait(randomBetween(mockApiConfig.latencyMs.min, mockApiConfig.latencyMs.max));

export const mockConversationApi: ConversationApi = {
  async fetchConversation() {
    await simulateLatency();
    switch (mockApiConfig.scenario) {
      case 'network_error':
        throw new NetworkError('Unable to load conversation.');
      case 'empty':
        return [];
      default:
        return createSeedConversation();
    }
  },

  async sendMessage() {
    await simulateLatency();
    if (Math.random() < mockApiConfig.sendFailureRate) {
      throw new NetworkError('Message could not be delivered.');
    }
    return { id: createId('srv'), createdAt: new Date().toISOString() };
  },

  async fetchAssistantReply(input) {
    await simulateLatency();
    const id = createId('ai');
    const reply = buildAssistantReply(input.text, id);
    return {
      id,
      type: 'ai',
      text: reply.text,
      recommendations: reply.recommendations,
      createdAt: new Date().toISOString(),
    };
  },
};
