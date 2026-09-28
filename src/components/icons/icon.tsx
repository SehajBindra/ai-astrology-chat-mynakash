import {
  Check,
  CircleAlert,
  Clock,
  Copy,
  Reply,
  RotateCcw,
  Send,
  Trash,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { memo } from 'react';

const ICONS = {
  send: Send,
  reply: Reply,
  copy: Copy,
  trash: Trash,
  retry: RotateCcw,
  close: X,
  check: Check,
  clock: Clock,
  alert: CircleAlert,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
}

export const Icon = memo(function IconComponent({
  name,
  size = 18,
  color,
  strokeWidth = 2,
}: IconProps) {
  const LucideIconComponent = ICONS[name];
  return (
    <LucideIconComponent size={size} color={color} strokeWidth={strokeWidth} />
  );
});
