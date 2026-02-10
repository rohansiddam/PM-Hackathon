import { Pressable, Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onDeconstruct: () => void;
  onResume: () => void;
  hasActiveSession: boolean;
  busy: boolean;
  errorMessage?: string;
};

const QUICK_SEEDS = [
  '2,000-word research paper',
  'Prepare for chemistry quiz',
  'Build slides for class presentation'
];

export function TaskDeconstructorCard({
  value,
  onChange,
  onDeconstruct,
  onResume,
  hasActiveSession,
  busy,
  errorMessage
}: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-ink/10 bg-white p-4">
      <Text className="text-lg font-bold text-ink">Task Deconstructor</Text>

      <View className="mt-2 flex-row gap-2">
        <View className="rounded-full bg-calm px-3 py-1">
          <Text className="text-xs font-semibold text-ink/75">Input</Text>
        </View>
        <View className="rounded-full bg-calm px-3 py-1">
          <Text className="text-xs font-semibold text-ink/75">Micro-steps</Text>
        </View>
        <View className="rounded-full bg-calm px-3 py-1">
          <Text className="text-xs font-semibold text-ink/75">Rewards</Text>
        </View>
      </View>

      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        placeholder="Describe one big assignment"
        placeholderTextColor="#687076"
        className="mt-3 min-h-[84px] rounded-xl border border-ink/15 bg-calm px-3 py-3 text-sm text-ink"
      />

      <View className="mt-2 flex-row flex-wrap gap-2">
        {QUICK_SEEDS.map((seed) => (
          <Pressable key={seed} onPress={() => onChange(seed)} className="rounded-full border border-ink/15 px-3 py-1">
            <Text className="text-xs font-medium text-ink/70">{seed}</Text>
          </Pressable>
        ))}
      </View>

      {errorMessage ? <Text className="mt-2 text-xs text-alert">{errorMessage}</Text> : null}

      <Pressable
        onPress={onDeconstruct}
        disabled={busy}
        className={`mt-3 rounded-xl px-4 py-3 ${busy ? 'bg-ink/40' : 'bg-accent'}`}
      >
        <Text className="text-center text-sm font-semibold text-white">{busy ? 'Deconstructing...' : 'Start Working Mode'}</Text>
      </Pressable>

      {hasActiveSession ? (
        <Pressable onPress={onResume} className="mt-2 rounded-xl border border-ink/15 px-4 py-3">
          <Text className="text-center text-sm font-semibold text-ink">Resume active working mode</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
