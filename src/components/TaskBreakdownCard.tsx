import { Pressable, Text, View } from 'react-native';
import { AcademicTask } from '../types/domain';

type Props = {
  task: AcademicTask;
  onMarkDone: (stepId: string) => void;
};

export function TaskBreakdownCard({ task, onMarkDone }: Props) {
  return (
    <View className="rounded-2xl border border-ink/10 bg-white p-4">
      <Text className="text-lg font-bold text-ink">{task.title}</Text>
      <Text className="text-sm text-ink/70">{task.course}</Text>
      <Text className="mb-3 text-xs text-ink/60">Due {new Date(task.dueAt).toLocaleString()}</Text>

      {task.steps.map((step) => (
        <Pressable
          key={step.id}
          onPress={() => onMarkDone(step.id)}
          disabled={step.done}
          className={`mb-2 rounded-xl border p-3 ${step.done ? 'border-accent bg-accent/10' : 'border-ink/10 bg-calm'}`}
        >
          <Text className={`text-sm font-medium ${step.done ? 'text-accent' : 'text-ink'}`}>
            {step.done ? 'Done: ' : 'Next: '}
            {step.label}
          </Text>
          <Text className="mt-1 text-xs text-ink/60">{step.estimatedMinutes} min</Text>
        </Pressable>
      ))}
    </View>
  );
}
