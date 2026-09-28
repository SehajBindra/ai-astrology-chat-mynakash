import { memo } from 'react';
import { Text, View } from 'react-native';

export const DateSeparator = memo(function DateSeparatorInner({
  label,
}: {
  label: string;
}) {
  return (
    <View
      className="flex-row items-center gap-3 px-4 pb-1 pt-5"
      accessibilityRole="header"
    >
      <View className="h-px flex-1 bg-separator" />
      <Text className="text-xs font-medium text-muted">{label}</Text>
      <View className="h-px flex-1 bg-separator" />
    </View>
  );
});
