import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import {
  conversationStore,
  useConversationStore,
} from "@/store/conversation-store";
import type { Message } from "@/types/message";
import { MessageActionSheet } from "@/features/conversation/actions/message-action-sheet";
import { getMessageActions } from "@/features/conversation/actions/message-actions";
import { Composer } from "@/features/conversation/composer/composer";
import {
  MessageInteractionsContext,
  type MessageInteractions,
} from "@/features/conversation/message-interactions-context";
import { EmptyState } from "@/features/conversation/states/empty-state";
import { ErrorState } from "@/features/conversation/states/error-state";
import { LoadingState } from "@/features/conversation/states/loading-state";
import { Timeline } from "@/features/conversation/timeline/timeline";

export function ConversationScreen() {
  const status = useConversationStore(state => state.status);
  const [actionTarget, setActionTarget] = useState<Message | null>(null);

  useEffect(() => {
    conversationStore.getState().loadConversation();
  }, []);

  const interactions = useMemo<MessageInteractions>(
    () => ({
      openActions: message => {
        if (getMessageActions(message).length > 0) {
          setActionTarget(message);
        }
      },
    }),
    [],
  );

  return (
    <MessageInteractionsContext.Provider value={interactions}>
      <KeyboardAvoidingView
        behavior="padding"
        automaticOffset
        style={styles.flex}
      >
        <View className="flex-1 bg-background">
          <View className="flex-1">
            <ConversationBody />
          </View>
          {status === 'ready' ? <Composer /> : null}
        </View>
      </KeyboardAvoidingView>
      <MessageActionSheet
        message={actionTarget}
        onClose={() => setActionTarget(null)}
      />
    </MessageInteractionsContext.Provider>
  );
}

function ConversationBody() {
  const status = useConversationStore(state => state.status);
  const error = useConversationStore(state => state.error);
  const isEmpty = useConversationStore(state => state.messageIds.length === 0);

  switch (status) {
    case 'idle':
    case 'loading':
      return <LoadingState />;
    case 'error':
      return (
        <ErrorState
          message={error}
          onRetry={() => conversationStore.getState().loadConversation()}
        />
      );
    case 'ready':
      return isEmpty ? <EmptyState /> : <Timeline />;
  }
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
