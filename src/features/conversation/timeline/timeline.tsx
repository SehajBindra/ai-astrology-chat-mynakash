import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { useConversationStore } from "@/store/conversation-store";
import type { Message } from "@/types/message";
import { MessageRow } from "@/features/conversation/messages/message-row";
import { buildTimeline, type TimelineItem } from './build-timeline';
import { DateSeparator } from './date-separator';
import { TypingIndicator } from './typing-indicator';

const keyExtractor = (item: TimelineItem) => item.key;

// Separate recycling pools per row shape: an AI row with a card rail should
// never be recycled into a one-line system event.
const getItemType = (item: TimelineItem) =>
  item.kind === 'date' ? 'date' : item.messageType;

const renderItem = ({ item }: { item: TimelineItem }) =>
  item.kind === 'date' ? (
    <DateSeparator label={item.label} />
  ) : (
    <MessageRow messageId={item.messageId} position={item.position} />
  );

export function Timeline() {
  const listRef = useRef<FlashListRef<TimelineItem>>(null);
  const messageIds = useConversationStore(state => state.messageIds);
  const messagesById = useConversationStore(state => state.messagesById);
  const isAssistantTyping = useConversationStore(
    state => state.isAssistantTyping,
  );

  const items = useMemo(
    () =>
      buildTimeline(
        messageIds
          .map(id => messagesById[id])
          .filter((m): m is Message => m !== undefined),
      ),
    [messageIds, messagesById],
  );

  // New messages near the bottom are followed by maintainVisibleContentPosition.
  // A message the user just sent should always be scrolled to, even if they had
  // scrolled up to read history.
  const lastId = messageIds[messageIds.length - 1];
  const lastMessage = lastId ? messagesById[lastId] : undefined;
  const lastIsOwnPending =
    lastMessage?.type === 'user' && lastMessage.status === 'sending';
  useEffect(() => {
    if (lastIsOwnPending) {
      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd({ animated: true }),
      );
    }
  }, [lastId, lastIsOwnPending]);

  const footer = useCallback(
    () => (isAssistantTyping ? <TypingIndicator /> : null),
    [isAssistantTyping],
  );

  return (
    <FlashList
      ref={listRef}
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      ListFooterComponent={footer}
      contentContainerStyle={styles.content}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      maintainVisibleContentPosition={{
        // Chat behaviour: start at the newest message, follow new messages
        // while the user is near the bottom, and keep the visible message
        // anchored when rows above it are inserted or deleted.
        startRenderingFromBottom: true,
        autoscrollToBottomThreshold: 0.2,
        animateAutoScrollToBottom: true,
      }}
    />
  );
}

// FlashList is not a Uniwind-bound component, so its container uses a style.
const styles = StyleSheet.create({ content: { paddingBottom: 12 } });
