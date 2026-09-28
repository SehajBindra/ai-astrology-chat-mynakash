import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import {
  BottomSheet,
  PressableFeedback,
  useThemeColor,
  useToast,
} from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Icon } from "@/components/icons/icon";
import { useConversationStore } from "@/store/conversation-store";
import type { Message } from "@/types/message";
import { senderLabel } from "@/features/conversation/messages/sender-label";
import {
  getMessageActions,
  type MessageAction,
  type MessageActionId,
} from './message-actions';

interface MessageActionSheetProps {
  message: Message | null;
  onClose(): void;
}

/** One sheet per screen; rows open it through MessageInteractionsContext. */
export function MessageActionSheet({
  message,
  onClose,
}: MessageActionSheetProps) {
  const { toast } = useToast();
  const setReplyTo = useConversationStore(state => state.setReplyTo);
  const deleteMessage = useConversationStore(state => state.deleteMessage);
  const retryMessage = useConversationStore(state => state.retryMessage);
  const [foreground, danger] = useThemeColor(['foreground', 'danger']);

  const run = async (id: MessageActionId, target: Message) => {
    onClose();
    switch (id) {
      case 'reply':
        setReplyTo(target.id);
        break;
      case 'copy':
        await Clipboard.setStringAsync(target.text);
        toast.show({ variant: 'success', label: 'Copied to clipboard' });
        break;
      case 'delete':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        deleteMessage(target.id);
        break;
      case 'retry':
        retryMessage(target.id);
        break;
    }
  };

  // Keep rendering the last message while the sheet animates closed.
  const [displayed, setDisplayed] = useState(message);
  if (message && message !== displayed) {
    setDisplayed(message);
  }
  const actions = displayed ? getMessageActions(displayed) : [];

  return (
    <BottomSheet
      isOpen={message !== null}
      onOpenChange={open => !open && onClose()}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          {displayed ? (
            <View className="gap-1 pb-2">
              {displayed.type !== 'ai' && displayed.type !== 'human' ? (
                <>
                  <BottomSheet.Title className="text-base">
                    {senderLabel(displayed)}
                  </BottomSheet.Title>
                  <BottomSheet.Description numberOfLines={2} className="mb-2">
                    {displayed.text}
                  </BottomSheet.Description>
                </>
              ) : null}
              {actions.map((action: MessageAction) => (
                <PressableFeedback
                  key={action.id}
                  onPress={() => run(action.id, displayed)}
                  className="flex-row items-center gap-3 rounded-2xl px-3 py-3.5"
                  accessibilityRole="button"
                >
                  <PressableFeedback.Highlight />
                  <Icon
                    name={action.icon}
                    size={20}
                    color={action.destructive ? danger : foreground}
                  />
                  <Text
                    className={
                      action.destructive
                        ? 'text-base text-danger'
                        : 'text-base text-foreground'
                    }
                  >
                    {action.label}
                  </Text>
                </PressableFeedback>
              ))}
            </View>
          ) : null}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
