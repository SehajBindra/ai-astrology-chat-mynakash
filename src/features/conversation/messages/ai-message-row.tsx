import { Pressable, Text, View } from 'react-native';

import { RecommendationRail } from '@/recommendations/recommendation-rail';
import type { AiMessage } from '@/types/message';
import { FeedbackBar } from '@/features/conversation/feedback/feedback-bar';
import { useMessageInteractions } from '@/features/conversation/message-interactions-context';
import type { GroupPosition } from '@/features/conversation/timeline/build-timeline';
import { MessageBubble } from './message-bubble';
import { MessageTime } from './message-time';
import { SenderAvatar } from './sender-avatar';

interface Props {
  message: AiMessage;
  position: GroupPosition;
}

export function AiMessageRow({ message, position }: Props) {
  const { openActions } = useMessageInteractions();
  const isGroupStart = position === 'first' || position === 'single';

  return (
    <View className="flex-row items-start gap-2">
      <SenderAvatar initials="AI" color="accent" visible={isGroupStart} />
      <View className="flex-1 items-start">
        {isGroupStart ? (
          <Text className="mb-1 ml-1 text-xs font-semibold text-foreground">
            AI Astrologer
          </Text>
        ) : null}
        <Pressable
          className="max-w-[88%]"
          onLongPress={() => openActions(message)}
          delayLongPress={300}
          accessibilityHint="Long press to reply, copy or delete"
        >
          <MessageBubble tone="ai" position={position}>
            <Text className="text-[15px] leading-5 text-foreground">
              {message.text}
            </Text>
          </MessageBubble>
        </Pressable>
        {message.recommendations?.length ? (
          <RecommendationRail recommendations={message.recommendations} />
        ) : null}
        <View className="ml-1 mt-1">
          <MessageTime createdAt={message.createdAt} />
        </View>
        <FeedbackBar messageId={message.id} />
      </View>
    </View>
  );
}
