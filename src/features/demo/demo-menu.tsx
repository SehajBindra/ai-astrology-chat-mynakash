import { BottomSheet, Button, PressableFeedback, Switch } from 'heroui-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { mockApiConfig, type MockScenario } from "@/api/conversation-api";
import { conversationStore } from "@/store/conversation-store";

const SCENARIOS: { id: MockScenario; label: string; description: string }[] = [
  {
    id: 'default',
    label: 'Normal conversation',
    description: 'Seeded chat with recommendations',
  },
  { id: 'empty', label: 'Empty conversation', description: 'No messages yet' },
  {
    id: 'network_error',
    label: 'Network failure',
    description: 'Loading the conversation fails',
  },
];

const DEFAULT_FAILURE_RATE = 0.2;

/**
 * Header menu for demoing loading / empty / error states and send failures
 * against the mock API. Not part of the product surface.
 */
export function DemoMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [scenario, setScenario] = useState(mockApiConfig.scenario);
  const [alwaysFail, setAlwaysFail] = useState(
    mockApiConfig.sendFailureRate >= 1,
  );

  const reloadWith = (next: MockScenario) => {
    mockApiConfig.scenario = next;
    setScenario(next);
    setIsOpen(false);
    conversationStore.getState().loadConversation();
  };

  const toggleAlwaysFail = (value: boolean) => {
    mockApiConfig.sendFailureRate = value ? 1 : DEFAULT_FAILURE_RATE;
    setAlwaysFail(value);
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen}>
      <BottomSheet.Trigger asChild>
        <Button size="sm" variant="ghost" accessibilityLabel="Demo scenarios">
          Demo
        </Button>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <BottomSheet.Title>Demo scenarios</BottomSheet.Title>
          <BottomSheet.Description className="mb-3">
            Reload the conversation from the mock API in a given state.
          </BottomSheet.Description>
          <View className="gap-1">
            {SCENARIOS.map(item => (
              <PressableFeedback
                key={item.id}
                onPress={() => reloadWith(item.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: scenario === item.id }}
                className="flex-row items-center justify-between rounded-2xl px-3 py-3"
              >
                <PressableFeedback.Highlight />
                <View>
                  <Text className="text-base text-foreground">
                    {item.label}
                  </Text>
                  <Text className="text-xs text-muted">{item.description}</Text>
                </View>
                {scenario === item.id ? (
                  <Text className="text-accent">●</Text>
                ) : null}
              </PressableFeedback>
            ))}
          </View>
          <View className="mt-3 flex-row items-center justify-between border-t border-border px-3 pb-2 pt-4">
            <View className="flex-1 pr-4">
              <Text className="text-base text-foreground">Fail every send</Text>
              <Text className="text-xs text-muted">
                Otherwise about 20% of sends fail
              </Text>
            </View>
            <Switch
              isSelected={alwaysFail}
              onSelectedChange={toggleAlwaysFail}
            />
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
