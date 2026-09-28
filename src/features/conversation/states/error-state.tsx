import { Button } from 'heroui-native';
import { Text } from 'react-native';

import { StateView } from './state-view';

interface ErrorStateProps {
  message?: string | null;
  onRetry(): void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <StateView
      icon={<Text className="text-5xl">📡</Text>}
      title="Unable to load conversation."
      description={
        message && message !== 'Unable to load conversation.'
          ? message
          : 'Check your connection and try again.'
      }
    >
      <Button className="mt-2" onPress={onRetry}>
        Retry
      </Button>
    </StateView>
  );
}
