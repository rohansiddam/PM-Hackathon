import { Pressable, Text, View } from 'react-native';

type Props = {
  onAddTask: () => void;
  onRefreshTransit: () => void;
  onResetDay: () => void;
};

export function QuickActions({ onAddTask, onRefreshTransit, onResetDay }: Props) {
  return (
    <View className="mb-4 flex-row flex-wrap gap-3">
      <Pressable onPress={onAddTask} className="min-w-[31%] flex-1 rounded-2xl bg-white p-4">
        <Text className="text-sm font-semibold text-ink">Load task</Text>
      </Pressable>
      <Pressable onPress={onRefreshTransit} className="min-w-[31%] flex-1 rounded-2xl bg-white p-4">
        <Text className="text-sm font-semibold text-ink">Refresh route</Text>
      </Pressable>
      <Pressable onPress={onResetDay} className="min-w-[31%] flex-1 rounded-2xl bg-focus p-4">
        <Text className="text-sm font-semibold text-ink">Reset day</Text>
      </Pressable>
    </View>
  );
}
