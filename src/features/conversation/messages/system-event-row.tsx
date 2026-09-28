import { Text, View } from 'react-native';

import type { SystemMessage } from "@/types/message";

export function SystemEventRow({ message }: { message: SystemMessage }) {
  return (
    <View className="items-center px-8">
      <Text className="rounded-full bg-default px-3 py-1 text-center text-xs text-muted">
        {message.text}
      </Text>
    </View>
  );
}
