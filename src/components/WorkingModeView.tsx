import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { WorkingModeState } from '../types/domain';
import { getElapsedSeconds } from '../services/workingModeService';

type Props = {
  workingMode: WorkingModeState;
  onToggleTimer: () => void;
  onCompleteStep: () => void;
  onExit: () => void;
};

const formatDuration = (seconds: number): string => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
};

export function WorkingModeView({ workingMode, onToggleTimer, onCompleteStep, onExit }: Props) {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    if (!workingMode.timer.isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [workingMode.timer.isRunning]);

  const elapsedSeconds = useMemo(() => getElapsedSeconds(workingMode, nowMs), [workingMode, nowMs]);
  const totalSteps = workingMode.plan.steps.length;
  const currentStep = workingMode.plan.steps[workingMode.activeStepIndex];
  const completedSteps = workingMode.plan.steps.filter((step) => step.done).length;
  const allDone = completedSteps === totalSteps;

  return (
    <SafeAreaView className="flex-1 bg-calm px-5">
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />

      <View className="mt-6 mb-3">
        <Text className="text-xs font-semibold uppercase tracking-wide text-ink/60">Working Mode</Text>
        <Text className="mt-1 text-3xl font-bold text-ink">Only this step</Text>
      </View>

      <View className="mb-4 rounded-2xl bg-white p-4">
        <Text className="text-sm text-ink/70">{workingMode.plan.sourceDescription}</Text>
        <Text className="mt-1 text-xs text-ink/50">
          Step {Math.min(workingMode.activeStepIndex + 1, totalSteps)} of {totalSteps}
        </Text>
      </View>

      <View className="mb-4 rounded-3xl bg-accent p-6">
        <Text className="text-center text-xs font-semibold uppercase tracking-wide text-white/80">Focus timer</Text>
        <Text className="mt-2 text-center text-5xl font-bold text-white">{formatDuration(elapsedSeconds)}</Text>
      </View>

      <View className="flex-1 rounded-3xl border border-ink/10 bg-white p-6">
        {allDone ? (
          <>
            <Text className="text-center text-2xl font-bold text-ink">All micro-steps complete</Text>
            <Text className="mt-3 text-center text-base text-ink/70">You finished this block. Close Working Mode and reset.</Text>
          </>
        ) : (
          <>
            <Text className="text-center text-xs font-semibold uppercase tracking-wide text-ink/50">Current micro-step</Text>
            <Text className="mt-5 text-center text-3xl font-bold text-ink">{currentStep?.label ?? 'No step available'}</Text>
            <Text className="mt-3 text-center text-sm text-ink/65">Estimated {currentStep?.estimatedMinutes ?? 1} minute(s)</Text>
          </>
        )}
      </View>

      <View className="mb-6 mt-4 gap-2">
        <Pressable onPress={onToggleTimer} className="rounded-xl bg-ink px-4 py-4">
          <Text className="text-center text-sm font-semibold text-white">
            {workingMode.timer.isRunning ? 'Pause timer' : 'Start timer'}
          </Text>
        </Pressable>

        {!allDone ? (
          <Pressable onPress={onCompleteStep} className="rounded-xl bg-focus px-4 py-4">
            <Text className="text-center text-sm font-semibold text-ink">Done. Show next step.</Text>
          </Pressable>
        ) : null}

        <Pressable onPress={onExit} className="rounded-xl border border-ink/20 px-4 py-4">
          <Text className="text-center text-sm font-semibold text-ink">Exit Working Mode</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
