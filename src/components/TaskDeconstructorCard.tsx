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
      <Text className="mt-1 text-sm text-ink/70">Paste a complex task. We split it into tiny, low-friction actions.</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        placeholder="Example: 2,000-word research paper on urban transit equity"
        placeholderTextColor="#687076"
        className="mt-3 min-h-[88px] rounded-xl border border-ink/15 bg-calm px-3 py-3 text-sm text-ink"
      />

      {errorMessage ? <Text className="mt-2 text-xs text-alert">{errorMessage}</Text> : null}

      <Pressable
        onPress={onDeconstruct}
        disabled={busy}
        className={`mt-3 rounded-xl px-4 py-3 ${busy ? 'bg-ink/40' : 'bg-accent'}`}
      >
        <Text className="text-center text-sm font-semibold text-white">
          {busy ? 'Deconstructing...' : 'Start Working Mode'}
        </Text>
      </Pressable>

      {hasActiveSession ? (
        <Pressable onPress={onResume} className="mt-2 rounded-xl border border-ink/15 px-4 py-3">
          <Text className="text-center text-sm font-semibold text-ink">Resume active working mode</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
