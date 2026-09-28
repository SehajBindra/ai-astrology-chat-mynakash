import { Avatar } from 'heroui-native';
import { View } from 'react-native';

interface SenderAvatarProps {
  initials: string;
  color: 'accent' | 'warning';
  /** Only the first message of a group shows the avatar; the rest keep the gutter. */
  visible: boolean;
}

export function SenderAvatar({ initials, color, visible }: SenderAvatarProps) {
  if (!visible) {
    return <View className="size-8" />;
  }
  return (
    <Avatar size="sm" color={color} variant="soft" alt={initials}>
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar>
  );
}
