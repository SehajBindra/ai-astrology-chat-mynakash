import { Button, Chip, useThemeColor } from 'heroui-native';
import { ThumbsDown, ThumbsUp, type LucideIcon } from 'lucide-react-native';
import { memo, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import { useConversationStore } from '@/store/conversation-store';
import { selectFeedback } from '@/store/selectors';
import {
  FEEDBACK_REASONS,
  type FeedbackRating,
  type FeedbackReason,
} from '@/types/feedback';
import { FeedbackThanksDialog } from './feedback-thanks-dialog';

const RATINGS: { rating: FeedbackRating; Icon: LucideIcon; label: string }[] =
  [
    { rating: 'like', Icon: ThumbsUp, label: 'Helpful' },
    { rating: 'dislike', Icon: ThumbsDown, label: 'Not helpful' },
  ];

export const FeedbackBar = memo(function FeedbackBarInner({
  messageId,
}: {
  messageId: string;
}) {
  const feedback = useConversationStore(selectFeedback(messageId));
  const setRating = useConversationStore(state => state.setRating);
  const toggleReason = useConversationStore(
    state => state.toggleFeedbackReason,
  );
  const [muted, foreground] = useThemeColor(['muted', 'foreground']);

  const [isThanksOpen, setIsThanksOpen] = useState(false);

  // Thank the user once their feedback is complete: a like, or the first
  // reason picked after a dislike. Later tweaks don't reopen the dialog.
  const handleRating = (rating: FeedbackRating) => {
    if (rating === 'like' && feedback.rating !== 'like') {
      setIsThanksOpen(true);
    }
    setRating(messageId, rating);
  };

  const handleReason = (reason: FeedbackReason) => {
    if (feedback.reasons.length === 0) {
      setIsThanksOpen(true);
    }
    toggleReason(messageId, reason);
  };

  return (
    <Animated.View layout={LinearTransition.duration(180)} className="mt-1.5">
      <View className="flex-row items-center gap-1">
        {RATINGS.map(({ rating, Icon, label }) => {
          const active = feedback.rating === rating;
          return (
            <Button
              key={rating}
              isIconOnly
              size="sm"
              variant={active ? 'secondary' : 'ghost'}
              className={active ? 'rounded-full' : 'rounded-full opacity-60'}
              onPress={() => handleRating(rating)}
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
            >
              <Icon size={16} color={active ? foreground : muted} />
            </Button>
          );
        })}
      </View>

      {feedback.rating === 'dislike' ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
          className="mt-1 flex-row flex-wrap gap-1.5"
          accessibilityLabel="What went wrong?"
        >
          {FEEDBACK_REASONS.map(reason => {
            const selected = feedback.reasons.includes(reason.id);
            return (
              // Chip is itself a Pressable, so it must own the press: a
              // wrapping pressable never receives the touch.
              <Chip
                key={reason.id}
                size="md"
                variant={selected ? 'primary' : 'secondary'}
                color={selected ? 'accent' : 'default'}
                onPress={() => handleReason(reason.id)}
                hitSlop={4}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                className="active:opacity-70"
              >
                {reason.label}
              </Chip>
            );
          })}
        </Animated.View>
      ) : null}

      <FeedbackThanksDialog
        rating={feedback.rating}
        isOpen={isThanksOpen}
        onOpenChange={setIsThanksOpen}
      />
    </Animated.View>
  );
});
