import { Text, View } from 'react-native';

import { useConversationStore } from "@/store/conversation-store";
import { selectMessage } from "@/store/selectors";
import { senderLabel } from './sender-label';

interface ReplyQuoteProps {
  messageId: string;
  onAccent?: boolean;
}

/** Quoted preview of the message being replied to, rendered inside a bubble. */
export function ReplyQuote({ messageId, onAccent }: ReplyQuoteProps) {
  const original = useConversationStore(selectMessage(messageId));

  return (
    <View
      className={
        onAccent
          ? 'mb-1.5 rounded-xl border-l-2 border-accent-foreground/70 bg-accent-foreground/15 px-2.5 py-1.5'
          : 'mb-1.5 rounded-xl border-l-2 border-accent bg-default px-2.5 py-1.5'
      }
    >
      <Text
        className={
          onAccent
            ? 'text-xs font-semibold text-accent-foreground'
            : 'text-xs font-semibold text-accent'
        }
      >
        {original ? senderLabel(original) : 'Message'}
      </Text>
      <Text
        numberOfLines={2}
        className={
          onAccent ? 'text-xs text-accent-foreground/80' : 'text-xs text-muted'
        }
      >
        {original ? original.text : 'Original message was deleted'}
      </Text>
    </View>
  );
}
