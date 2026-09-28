import { Button, Input, useThemeColor } from 'heroui-native';
import { useEffect, useRef, useState } from 'react';
import { type TextInput, View } from 'react-native';
import { useKeyboardState } from 'react-native-keyboard-controller';

import { Icon } from "@/components/icons/icon";
import { useConversationStore } from "@/store/conversation-store";
import { ReplyPreview } from './reply-preview';

const MAX_LENGTH = 1000;

export function Composer() {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const sendMessage = useConversationStore(state => state.sendMessage);
  const replyToId = useConversationStore(state => state.replyToId);
  const isKeyboardVisible = useKeyboardState(state => state.isVisible);
  const accentForeground = useThemeColor('accent-foreground');

  // Choosing "Reply" should put the cursor straight into the composer.
  useEffect(() => {
    if (replyToId) {
      inputRef.current?.focus();
    }
  }, [replyToId]);

  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    // Fire and forget: the store tracks sending / sent / failed per message,
    // so the composer is free for the next message immediately.
    sendMessage(text);
    setText('');
  };

  return (
    <View
      className={`border-t border-border bg-background px-3 pt-2 ${
        // The keyboard already covers the home indicator area.
        isKeyboardVisible ? 'pb-2' : 'pb-safe-or-2'
      }`}
    >
      <ReplyPreview />
      <View className="flex-row items-end gap-2">
        <Input
          ref={inputRef}
          value={text}
          onChangeText={setText}
          placeholder="Ask about your chart…"
          multiline
          maxLength={MAX_LENGTH}
          textAlignVertical="center"
          className="max-h-32 flex-1 rounded-3xl py-3.5 text-[15px] leading-5"
          accessibilityLabel="Message"
        />
        <Button
          isIconOnly
          variant="primary"
          className="rounded-full"
          isDisabled={!canSend}
          onPress={handleSend}
          accessibilityLabel="Send message"
        >
          <Icon name="send" size={18} color={accentForeground} />
        </Button>
      </View>
    </View>
  );
}
