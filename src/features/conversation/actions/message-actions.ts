import type { IconName } from "@/components/icons/icon";
import type { Message } from "@/types/message";

export type MessageActionId = 'reply' | 'copy' | 'delete' | 'retry';

export interface MessageAction {
  id: MessageActionId;
  label: string;
  icon: IconName;
  destructive?: boolean;
}

const ACTIONS: Record<MessageActionId, MessageAction> = {
  reply: { id: 'reply', label: 'Reply', icon: 'reply' },
  copy: { id: 'copy', label: 'Copy', icon: 'copy' },
  delete: { id: 'delete', label: 'Delete', icon: 'trash', destructive: true },
  retry: { id: 'retry', label: 'Retry sending', icon: 'retry' },
};

/** Which long-press actions a message supports. */
export function getMessageActions(message: Message): MessageAction[] {
  switch (message.type) {
    case 'ai':
      return [ACTIONS.reply, ACTIONS.copy, ACTIONS.delete];
    case 'human':
      return [ACTIONS.reply, ACTIONS.copy];
    case 'user':
      return message.status === 'failed'
        ? [ACTIONS.retry, ACTIONS.copy, ACTIONS.delete]
        : [ACTIONS.copy, ACTIONS.delete];
    case 'system':
      return [];
  }
}
