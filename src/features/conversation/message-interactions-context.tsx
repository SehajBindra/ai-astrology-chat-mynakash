import { createContext, useContext } from 'react';

import type { Message } from "@/types/message";

/**
 * Screen-level interactions that deeply nested rows need but should not
 * own (e.g. the action sheet lives once at the screen, not once per row).
 */
export interface MessageInteractions {
  openActions(message: Message): void;
}

const noop: MessageInteractions = { openActions: () => {} };

export const MessageInteractionsContext =
  createContext<MessageInteractions>(noop);

export const useMessageInteractions = () =>
  useContext(MessageInteractionsContext);
