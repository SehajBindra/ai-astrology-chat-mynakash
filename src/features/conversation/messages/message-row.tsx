import { memo } from 'react';
import { View } from 'react-native';

import { useConversationStore } from "@/store/conversation-store";
import { selectMessage } from "@/store/selectors";
import type { Message } from "@/types/message";
import type { GroupPosition } from "@/features/conversation/timeline/build-timeline";
import { AiMessageRow } from './ai-message-row';
import { HumanMessageRow } from './human-message-row';
import { SystemEventRow } from './system-event-row';
import { UserMessageRow } from './user-message-row';

interface MessageRowProps {
  messageId: string;
  position: GroupPosition;
}

function renderMessage(message: Message, position: GroupPosition) {
  // Exhaustive switch: adding a MessageType without a renderer is a type error.
  switch (message.type) {
    case 'user':
      return <UserMessageRow message={message} position={position} />;
    case 'ai':
      return <AiMessageRow message={message} position={position} />;
    case 'human':
      return <HumanMessageRow message={message} position={position} />;
    case 'system':
      return <SystemEventRow message={message} />;
  }
}

/**
 * A timeline row subscribes to its own message only, so a status change on
 * one message re-renders one row rather than the list.
 */
export const MessageRow = memo(function MessageRowInner({
  messageId,
  position,
}: MessageRowProps) {
  const message = useConversationStore(selectMessage(messageId));
  if (!message) {
    return null;
  }

  const startsGroup = position === 'first' || position === 'single';
  return (
    <View className={startsGroup ? 'px-4 pt-3' : 'px-4 pt-1'}>
      {renderMessage(message, position)}
    </View>
  );
});
