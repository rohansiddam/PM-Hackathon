import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { FocusCard } from './src/components/FocusCard';
import { TransitPlanCard } from './src/components/TransitPlanCard';
import { QuickActions } from './src/components/QuickActions';
import { TaskBreakdownCard } from './src/components/TaskBreakdownCard';
import { SyncBanner } from './src/components/SyncBanner';
import { useOrchestrator } from './src/hooks/useOrchestrator';

export default function App() {
  const {
    state,
    addDemoTask,
    markStepDone,
    refreshTransit,
    quickResetDay,
    forceSync
  } = useOrchestrator();

  return (
    <SafeAreaView className="flex-1 bg-calm">
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />
      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="mt-4 mb-4">
          <Text className="text-3xl font-bold text-ink">Chronos</Text>
          <Text className="text-base text-ink/70">One next step. No overload.</Text>
        </View>

        <SyncBanner
          online={state.online}
          pendingSync={state.pendingSync}
          lastSyncedAt={state.lastSyncedAt}
          onSync={forceSync}
        />

        <FocusCard nextStep={state.nextStepLabel} currentStressScore={state.stressScore} />

        <QuickActions
          onAddTask={addDemoTask}
          onRefreshTransit={refreshTransit}
          onResetDay={quickResetDay}
        />

        <TransitPlanCard trip={state.transitTrip} />

        <TaskBreakdownCard task={state.primaryTask} onMarkDone={markStepDone} />
      </ScrollView>
    </SafeAreaView>
  );
}
