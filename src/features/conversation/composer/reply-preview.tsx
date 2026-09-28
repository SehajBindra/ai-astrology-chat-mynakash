import { Button, useThemeColor } from 'heroui-native';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { Icon } from "@/components/icons/icon";
import { useConversationStore } from "@/store/conversation-store";
import { selectReplyTarget } from "@/store/selectors";
import { senderLabel } from "@/features/conversation/messages/sender-label";

/** "Replying to …" bar shown above the composer while a reply is pending. */
export function ReplyPreview() {
  const target = useConversationStore(selectReplyTarget);
  const setReplyTo = useConversationStore(state => state.setReplyTo);
  const muted = useThemeColor('muted');

  if (!target) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      exiting={FadeOutDown.duration(120)}
      className="mb-2 flex-row items-center gap-2 rounded-2xl bg-default px-3 py-2"
    >
      <View className="w-0.5 self-stretch rounded-full bg-accent" />
      <View className="flex-1">
        <Text className="text-xs font-semibold text-accent">
          Replying to {senderLabel(target)}
        </Text>
        <Text numberOfLines={1} className="text-xs text-muted">
          {target.text}
        </Text>
      </View>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={() => setReplyTo(null)}
        accessibilityLabel="Cancel reply"
      >
        <Icon name="close" size={16} color={muted} />
      </Button>
    </Animated.View>
  );
}
