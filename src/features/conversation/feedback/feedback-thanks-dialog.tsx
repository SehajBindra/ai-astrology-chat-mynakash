import { Button, Dialog, useThemeColor } from 'heroui-native';
import {
  HeartHandshake,
  Sparkles,
  type LucideIcon,
} from 'lucide-react-native';
import { View } from 'react-native';

import type { FeedbackRating } from '@/types/feedback';

const COPY: Record<FeedbackRating, { Icon: LucideIcon; body: string }> = {
  like: {
    Icon: HeartHandshake,
    body: "Glad this helped. We'll keep readings like this coming.",
  },
  dislike: {
    Icon: Sparkles,
    body: "We'll use this to make future readings more useful for you.",
  },
};

interface Props {
  rating: FeedbackRating | null;
  isOpen: boolean;
  onOpenChange(open: boolean): void;
}

/** Confirmation shown once a message's feedback is complete. */
export function FeedbackThanksDialog({ rating, isOpen, onOpenChange }: Props) {
  const copy = COPY[rating ?? 'like'];
  const [accent] = useThemeColor(['accent']);
  const { Icon } = copy;

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="items-center gap-4">
          <View className="size-16 items-center justify-center rounded-full bg-accent/10">
            <Icon size={28} color={accent} />
          </View>
          <View className="items-center gap-1.5">
            <Dialog.Title className="text-center">
              Thanks for the feedback
            </Dialog.Title>
            <Dialog.Description className="text-center">
              {copy.body}
            </Dialog.Description>
          </View>
          <Button className="self-stretch" onPress={() => onOpenChange(false)}>
            Done
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
