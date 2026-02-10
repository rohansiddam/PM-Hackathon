import { Text, View } from 'react-native';
import { TransitTrip } from '../types/domain';

type Props = {
  trip: TransitTrip;
};

export function TransitPlanCard({ trip }: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-ink/10 bg-white p-4">
      <Text className="text-lg font-bold text-ink">Transit Plan</Text>
      <Text className="mt-2 text-sm text-ink/80">{trip.routeName}</Text>
      <Text className="text-sm text-ink/70">Leave {trip.departureTime} • Arrive {trip.arrivalTime}</Text>
      <Text className="mt-2 text-xs font-semibold text-ink/60">Confidence: {trip.confidence}</Text>
      {trip.disruptions.map((line) => (
        <Text key={line} className="mt-1 text-xs text-alert">{line}</Text>
      ))}
    </View>
  );
}
