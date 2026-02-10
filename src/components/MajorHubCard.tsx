import { Pressable, Text, View } from 'react-native';
import { HubBuilding, SilentCoworkingRoom } from '../types/domain';

type Props = {
  currentHub?: HubBuilding;
  hubRoom?: SilentCoworkingRoom;
  hubMessage?: string;
  locating: boolean;
  refreshing: boolean;
  onDetectHub: () => void;
  onOpenRoom: () => void;
  onRefreshRoom: () => void;
};

export function MajorHubCard({
  currentHub,
  hubRoom,
  hubMessage,
  locating,
  refreshing,
  onDetectHub,
  onOpenRoom,
  onRefreshRoom
}: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-ink/10 bg-white p-4">
      <Text className="text-lg font-bold text-ink">Major-specific Hub</Text>
      <Text className="mt-1 text-sm text-ink/70">Detect your building and join silent co-working in one tap.</Text>

      {currentHub ? (
        <View className="mt-3 rounded-xl bg-calm p-3">
          <Text className="text-sm font-semibold text-ink">{currentHub.code} • {currentHub.majorTrack}</Text>
          <Text className="text-xs text-ink/70">{currentHub.name}</Text>
          <Text className="mt-1 text-xs text-ink/60">
            {hubRoom ? `${hubRoom.members.length} student icon(s) active` : 'No room snapshot yet'}
          </Text>
        </View>
      ) : (
        <View className="mt-3 rounded-xl bg-calm p-3">
          <Text className="text-sm text-ink/75">No major-specific hub detected yet.</Text>
        </View>
      )}

      {hubMessage ? <Text className="mt-2 text-xs text-ink/65">{hubMessage}</Text> : null}

      <View className="mt-3 gap-2">
        <Pressable onPress={onDetectHub} disabled={locating} className={`rounded-xl px-4 py-3 ${locating ? 'bg-ink/40' : 'bg-ink'}`}>
          <Text className="text-center text-sm font-semibold text-white">
            {locating ? 'Detecting location...' : 'Detect my hub'}
          </Text>
        </Pressable>

        <View className="flex-row gap-2">
          <Pressable
            onPress={onRefreshRoom}
            disabled={!currentHub || refreshing}
            className={`flex-1 rounded-xl px-4 py-3 ${!currentHub || refreshing ? 'bg-accent/30' : 'bg-accent'}`}
          >
            <Text className="text-center text-sm font-semibold text-white">
              {refreshing ? 'Refreshing...' : 'Refresh room'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onOpenRoom}
            disabled={!currentHub}
            className={`flex-1 rounded-xl px-4 py-3 ${!currentHub ? 'bg-focus/40' : 'bg-focus'}`}
          >
            <Text className="text-center text-sm font-semibold text-ink">Open room</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
