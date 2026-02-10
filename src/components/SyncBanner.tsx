import { Pressable, Text, View } from 'react-native';

type Props = {
  online: boolean;
  pendingSync: number;
  lastSyncedAt?: string;
  onSync: () => void;
};

export function SyncBanner({ online, pendingSync, lastSyncedAt, onSync }: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-ink/10 bg-white p-4">
      <Text className="text-sm font-semibold text-ink">
        {online ? 'Online and ready' : 'Offline mode active'}
      </Text>
      <Text className="mt-1 text-sm text-ink/70">
        {pendingSync} update(s) queued {lastSyncedAt ? `• Last sync ${new Date(lastSyncedAt).toLocaleTimeString()}` : ''}
      </Text>
      <Pressable onPress={onSync} className="mt-3 rounded-xl bg-ink px-4 py-3">
        <Text className="text-center text-sm font-semibold text-white">Sync now</Text>
      </Pressable>
    </View>
  );
}
