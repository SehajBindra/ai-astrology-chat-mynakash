import { Pressable, Text, View } from 'react-native';

import type { UserMessage } from "@/types/message";
import { useMessageInteractions } from "@/features/conversation/message-interactions-context";
import type { GroupPosition } from "@/features/conversation/timeline/build-timeline";
import { DeliveryStatus } from './delivery-status';
import { MessageBubble } from './message-bubble';
import { MessageTime } from './message-time';
import { ReplyQuote } from './reply-quote';

interface Props {
  message: UserMessage;
  position: GroupPosition;
}

export function UserMessageRow({ message, position }: Props) {
  const { openActions } = useMessageInteractions();
  const showMeta =
    position === 'last' || position === 'single' || message.status !== 'sent';

  return (
    <View className="items-end pl-12">
      <Pressable
        onLongPress={() => openActions(message)}
        delayLongPress={300}
        accessibilityHint="Long press for message actions"
      >
        <MessageBubble
          tone="user"
          position={position}
          failed={message.status === 'failed'}
        >
          {message.replyToId ? (
            <ReplyQuote messageId={message.replyToId} onAccent />
          ) : null}
          <Text className="text-[15px] leading-5 text-accent-foreground">
            {message.text}
          </Text>
        </MessageBubble>
      </Pressable>
      {showMeta ? (
        <View className="mt-1 flex-row items-center gap-2">
          <MessageTime createdAt={message.createdAt} />
          <DeliveryStatus message={message} />
        </View>
      ) : null}
    </View>
  );
}
