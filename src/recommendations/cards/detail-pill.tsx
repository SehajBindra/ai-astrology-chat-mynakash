import { Text, View } from 'react-native';

/** Small key detail shown on a recommendation card ("6 min read", "₹25/min"). */
export function DetailPill({ children }: { children: string }) {
  return (
    <View className="mt-1 self-start rounded-full bg-default px-2 py-0.5">
      <Text className="text-[11px] font-medium text-default-foreground">
        {children}
      </Text>
    </View>
  );
}
