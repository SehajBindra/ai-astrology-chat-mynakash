import { Chip, PressableFeedback } from 'heroui-native';
import { Text, View } from 'react-native';

import { useConversationStore } from "@/store/conversation-store";
import { StateView } from './state-view';

const STARTERS = [
  'How will my career go this year?',
  'When is a good time for marriage?',
  'Which gemstone suits me?',
];

export function EmptyState() {
  const sendMessage = useConversationStore(state => state.sendMessage);

  return (
    <StateView
      icon={<Text className="text-5xl">🪐</Text>}
      title="Start your conversation."
      description="Ask the AI Astrologer anything about your chart, or pick a question below."
    >
      <View className="mt-2 items-center gap-2">
        {STARTERS.map(starter => (
          <PressableFeedback
            key={starter}
            onPress={() => sendMessage(starter)}
            accessibilityRole="button"
            className="rounded-full"
          >
            <Chip size="lg" variant="secondary">
              {starter}
            </Chip>
          </PressableFeedback>
        ))}
      </View>
    </StateView>
  );
}
