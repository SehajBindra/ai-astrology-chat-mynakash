import type { Message } from "@/types/message";

export function senderLabel(message: Message): string {
  switch (message.type) {
    case 'user':
      return 'You';
    case 'ai':
      return 'AI Astrologer';
    case 'human':
      return message.author.name;
    case 'system':
      return 'MyNaksh';
  }
}
