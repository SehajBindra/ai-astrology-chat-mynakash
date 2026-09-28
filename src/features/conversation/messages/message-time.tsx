import { Text } from 'react-native';

import { formatTime } from "@/utils/date";

export function MessageTime({ createdAt }: { createdAt: string }) {
  return (
    <Text className="text-[11px] text-muted">
      {formatTime(new Date(createdAt))}
    </Text>
  );
}
