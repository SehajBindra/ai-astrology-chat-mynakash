import { Chip } from 'heroui-native';
import { Pressable, Text, View } from 'react-native';

import type { HumanMessage } from '@/types/message';
import { useMessageInteractions } from '@/features/conversation/message-interactions-context';
import type { GroupPosition } from '@/features/conversation/timeline/build-timeline';
import { MessageBubble } from './message-bubble';
import { MessageTime } from './message-time';
import { SenderAvatar } from './sender-avatar';

interface Props {
  message: HumanMessage;
  position: GroupPosition;
}

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .slice(-2)
    .join('')
    .toUpperCase();

export function HumanMessageRow({ message, position }: Props) {
  const { openActions } = useMessageInteractions();
  const isGroupStart = position === 'first' || position === 'single';
  const isGroupEnd = position === 'last' || position === 'single';

  return (
    <View className="flex-row items-start gap-2 pr-12">
      <SenderAvatar
        initials={initialsOf(message.author.name)}
        color="warning"
        visible={isGroupStart}
      />
      <View className="shrink items-start">
        {isGroupStart ? (
          <View className="mb-1 ml-1 flex-row items-center gap-1.5">
            <Text className="text-xs font-semibold text-foreground">
              {message.author.name}
            </Text>
            <Chip size="sm" variant="soft" color="warning">
              Astrologer
            </Chip>
          </View>
        ) : null}
        <Pressable
          onLongPress={() => openActions(message)}
          delayLongPress={300}
        >
          <MessageBubble tone="human" position={position}>
            <Text className="text-[15px] leading-5 text-foreground">
              {message.text}
            </Text>
          </MessageBubble>
        </Pressable>
        {isGroupEnd ? (
          <View className="ml-1 mt-1">
            <MessageTime createdAt={message.createdAt} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
