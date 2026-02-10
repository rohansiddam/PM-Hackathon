import { Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SilentCoworkingRoom } from '../types/domain';

type Props = {
  room: SilentCoworkingRoom;
  refreshing: boolean;
  onRefresh: () => void;
  onExit: () => void;
};

export function SilentCoworkingRoomView({ room, refreshing, onRefresh, onExit }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-calm px-5">
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />

      <View className="mt-6 mb-4">
        <Text className="text-xs font-semibold uppercase tracking-wide text-ink/60">Silent Co-working</Text>
        <Text className="mt-1 text-3xl font-bold text-ink">{room.hubCode} Hub</Text>
        <Text className="text-sm text-ink/70">{room.hubName} • {room.majorTrack}</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-ink/10 bg-white p-4">
        <Text className="text-sm text-ink/70">Students currently studying</Text>
        <Text className="mt-1 text-xs text-ink/60">Updated {new Date(room.updatedAt).toLocaleTimeString()}</Text>

        <View className="mt-4 flex-row flex-wrap gap-3">
          {room.members.map((member) => (
            <View key={member.id} className="items-center">
              <View className={`h-14 w-14 items-center justify-center rounded-full ${member.isYou ? 'bg-accent' : 'bg-ink/15'}`}>
                <Text className={`text-base font-bold ${member.isYou ? 'text-white' : 'text-ink'}`}>{member.initials}</Text>
              </View>
              <Text className="mt-1 text-[10px] text-ink/60">{member.majorTrack}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-6 mt-auto gap-2">
        <Pressable onPress={onRefresh} className="rounded-xl bg-ink px-4 py-4">
          <Text className="text-center text-sm font-semibold text-white">
            {refreshing ? 'Refreshing room...' : 'Refresh student icons'}
          </Text>
        </Pressable>
        <Pressable onPress={onExit} className="rounded-xl border border-ink/20 px-4 py-4">
          <Text className="text-center text-sm font-semibold text-ink">Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
