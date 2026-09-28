import { Button, useThemeColor } from 'heroui-native';
import { Text, View } from 'react-native';

import { Icon } from "@/components/icons/icon";
import { useConversationStore } from "@/store/conversation-store";
import type { UserMessage } from "@/types/message";

export function DeliveryStatus({ message }: { message: UserMessage }) {
  const retryMessage = useConversationStore(state => state.retryMessage);
  const [muted, danger] = useThemeColor(['muted', 'danger']);

  switch (message.status) {
    case 'sending':
      return (
        <View className="flex-row items-center gap-1">
          <Icon name="clock" size={11} color={muted} />
          <Text className="text-[11px] text-muted">Sending…</Text>
        </View>
      );
    case 'sent':
      return null;
    case 'failed':
      return (
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Icon name="alert" size={11} color={danger} />
            <Text className="text-[11px] text-danger">Failed</Text>
          </View>
          <Button
            size="sm"
            variant="danger-soft"
            className="h-7 px-2.5"
            onPress={() => retryMessage(message.id)}
            accessibilityLabel="Retry sending message"
          >
            <Icon name="retry" size={12} color={danger} />
            <Button.Label>Retry</Button.Label>
          </Button>
        </View>
      );
  }
}
