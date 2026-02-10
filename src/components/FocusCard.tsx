import { Text, View } from 'react-native';

type Props = {
  nextStep: string;
  currentStressScore: number;
};

export function FocusCard({ nextStep, currentStressScore }: Props) {
  return (
    <View className="mb-4 rounded-3xl bg-accent p-5">
      <Text className="text-xs font-semibold uppercase tracking-wide text-white/80">Focus right now</Text>
      <Text className="mt-2 text-2xl font-bold text-white">{nextStep}</Text>
      <Text className="mt-3 text-sm text-white/90">Cognitive load score: {currentStressScore}/100</Text>
    </View>
  );
}
