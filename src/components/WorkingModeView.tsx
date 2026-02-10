import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { WorkingModeState } from '../types/domain';
import { getElapsedSeconds } from '../services/workingModeService';
import { ConfettiBurst } from './ConfettiBurst';

type Props = {
  workingMode: WorkingModeState;
  onToggleTimer: () => void;
  onCompleteStep: () => void;
  onExit: () => void;
};

type Badge = {
  id: string;
  label: string;
  threshold: number;
};

const BADGES: Badge[] = [
  { id: 'launch', label: 'Launch', threshold: 1 },
  { id: 'momentum', label: 'Momentum', threshold: 3 },
  { id: 'focus', label: 'Focus Chain', threshold: 5 },
  { id: 'finisher', label: 'Finisher', threshold: 8 }
];

const formatDuration = (seconds: number): string => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
};

const getTaskTone = (stepLabel?: string): string => {
  if (!stepLabel) {
    return 'Done';
  }

  const label = stepLabel.toLowerCase();
  if (label.includes('break')) {
    return 'Recover';
  }
  if (label.includes('submit') || label.includes('schedule')) {
    return 'Closeout';
  }
  if (label.includes('open') || label.includes('start')) {
    return 'Boot';
  }
  return 'Focus';
};

export function WorkingModeView({ workingMode, onToggleTimer, onCompleteStep, onExit }: Props) {
  const [nowMs, setNowMs] = useState(Date.now());
  const [confettiToken, setConfettiToken] = useState(0);
  const [boostMessage, setBoostMessage] = useState<string>();

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
  const milestoneBadges = BADGES.filter((badge) => completedSteps >= badge.threshold);
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const previousCompletedRef = useRef(completedSteps);

  useEffect(() => {
    if (completedSteps <= previousCompletedRef.current) {
      return;
    }

    setConfettiToken((value) => value + 1);

    const newlyUnlocked = BADGES.find(
      (badge) => completedSteps >= badge.threshold && previousCompletedRef.current < badge.threshold
    );

    setBoostMessage(newlyUnlocked ? `Badge unlocked: ${newlyUnlocked.label}` : 'Step badge earned');

    const timer = setTimeout(() => {
      setBoostMessage(undefined);
    }, 1800);

    previousCompletedRef.current = completedSteps;

    return () => clearTimeout(timer);
  }, [completedSteps]);

  const xp = completedSteps * 15;
  const visibleStepBadges = Math.min(completedSteps, 6);
  const extraBadges = Math.max(0, completedSteps - visibleStepBadges);

  return (
    <SafeAreaView className="flex-1 bg-calm px-5">
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />
      <ConfettiBurst triggerKey={confettiToken} />

      <View className="mt-6 mb-3">
        <Text className="text-xs font-semibold uppercase tracking-wide text-ink/60">Working Mode</Text>
        <Text className="mt-1 text-3xl font-bold text-ink">One move only</Text>
      </View>

      <View className="mb-3 rounded-2xl border border-ink/10 bg-white p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-ink">Progress</Text>
          <Text className="text-sm font-bold text-ink">{progressPercent}%</Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-calm">
          <View className="h-2 rounded-full bg-accent" style={{ width: `${progressPercent}%` }} />
        </View>
        <Text className="mt-2 text-xs text-ink/60">
          {completedSteps}/{totalSteps} steps complete
        </Text>
      </View>

      <View className="mb-3 flex-row gap-2">
        <View className="flex-1 rounded-2xl bg-white p-3">
          <Text className="text-xs uppercase tracking-wide text-ink/55">XP</Text>
          <Text className="mt-1 text-2xl font-bold text-ink">{xp}</Text>
        </View>

        <View className="flex-[1.6] rounded-2xl bg-white p-3">
          <Text className="text-xs uppercase tracking-wide text-ink/55">Step badges</Text>
          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            {visibleStepBadges > 0 ? (
              Array.from({ length: visibleStepBadges }, (_, index) => (
                <View key={`step-badge-${index + 1}`} className="h-7 w-7 items-center justify-center rounded-full bg-focus">
                  <Text className="text-xs font-bold text-ink">{index + 1}</Text>
                </View>
              ))
            ) : (
              <Text className="text-xs text-ink/45">Complete 1 step to earn badges</Text>
            )}

            {extraBadges > 0 ? (
              <View className="h-7 min-w-[28px] items-center justify-center rounded-full bg-ink/15 px-1">
                <Text className="text-xs font-semibold text-ink">+{extraBadges}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {milestoneBadges.length > 0 ? (
        <View className="mb-3 rounded-2xl border border-ink/10 bg-white px-3 py-2">
          <Text className="text-xs uppercase tracking-wide text-ink/55">Milestones</Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {milestoneBadges.map((badge) => (
              <View key={badge.id} className="rounded-full bg-accent/15 px-3 py-1">
                <Text className="text-xs font-semibold text-accent">{badge.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {boostMessage ? (
        <View className="mb-3 rounded-xl border border-accent/35 bg-accent/12 px-3 py-2">
          <Text className="text-center text-xs font-semibold text-accent">{boostMessage}</Text>
        </View>
      ) : null}

      <View className="mb-3 rounded-3xl bg-accent p-5">
        <Text className="text-center text-xs font-semibold uppercase tracking-wide text-white/80">Focus timer</Text>
        <Text className="mt-2 text-center text-5xl font-bold text-white">{formatDuration(elapsedSeconds)}</Text>
      </View>

      <View className="flex-1 rounded-3xl border border-ink/10 bg-white p-6">
        {allDone ? (
          <>
            <Text className="text-center text-xs font-semibold uppercase tracking-wide text-ink/50">Status</Text>
            <Text className="mt-4 text-center text-3xl font-bold text-ink">All steps complete</Text>
            <Text className="mt-3 text-center text-sm text-ink/65">Great block. Exit and start the next one.</Text>
          </>
        ) : (
          <>
            <Text className="text-center text-xs font-semibold uppercase tracking-wide text-ink/50">
              {getTaskTone(currentStep?.label)}
            </Text>
            <Text className="mt-5 text-center text-3xl font-bold text-ink">{currentStep?.label ?? 'No step available'}</Text>
            <Text className="mt-3 text-center text-sm text-ink/65">{currentStep?.estimatedMinutes ?? 1} min target</Text>
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
            <Text className="text-center text-sm font-semibold text-ink">Complete step</Text>
          </Pressable>
        ) : null}

        <Pressable onPress={onExit} className="rounded-xl border border-ink/20 px-4 py-4">
          <Text className="text-center text-sm font-semibold text-ink">Exit Working Mode</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
