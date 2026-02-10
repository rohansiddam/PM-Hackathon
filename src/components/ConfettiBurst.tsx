import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type Props = {
  triggerKey: number;
};

type PieceAnimation = {
  translateX: Animated.Value;
  translateY: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
};

const PIECE_COUNT = 22;
const COLORS = ['#FFD166', '#0E7A5F', '#EF476F', '#118AB2', '#06D6A0', '#F4A261'];

export function ConfettiBurst({ triggerKey }: Props) {
  const animations = useRef<PieceAnimation[]>(
    Array.from({ length: PIECE_COUNT }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(-18),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.4)
    }))
  ).current;

  const piecePlan = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const spread = direction * (45 + (index % 7) * 18);
        const fall = 220 + (index % 6) * 45;
        const delay = (index % 8) * 25;
        const rotation = 0.7 + (index % 5) * 0.4;

        return {
          spread,
          fall,
          delay,
          rotation,
          color: COLORS[index % COLORS.length]
        };
      }),
    []
  );

  useEffect(() => {
    if (triggerKey === 0) {
      return;
    }

    const runners = animations.map((piece, index) => {
      const plan = piecePlan[index];

      piece.translateX.setValue(0);
      piece.translateY.setValue(-18);
      piece.rotate.setValue(0);
      piece.opacity.setValue(0);
      piece.scale.setValue(0.5);

      return Animated.sequence([
        Animated.delay(plan.delay),
        Animated.parallel([
          Animated.timing(piece.opacity, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true
          }),
          Animated.timing(piece.scale, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(piece.translateX, {
            toValue: plan.spread,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
          }),
          Animated.timing(piece.translateY, {
            toValue: plan.fall,
            duration: 900,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
          }),
          Animated.timing(piece.rotate, {
            toValue: plan.rotation,
            duration: 900,
            useNativeDriver: true
          }),
          Animated.timing(piece.opacity, {
            toValue: 0,
            delay: 600,
            duration: 260,
            useNativeDriver: true
          })
        ])
      ]);
    });

    Animated.parallel(runners).start();
  }, [animations, piecePlan, triggerKey]);

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {animations.map((piece, index) => {
        const plan = piecePlan[index];

        return (
          <Animated.View
            key={`confetti-${index}`}
            style={[
              styles.piece,
              {
                backgroundColor: plan.color,
                opacity: piece.opacity,
                transform: [
                  { translateX: piece.translateX },
                  { translateY: piece.translateY },
                  {
                    rotate: piece.rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '300deg']
                    })
                  },
                  { scale: piece.scale }
                ]
              }
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30
  },
  piece: {
    position: 'absolute',
    top: 72,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 12,
    borderRadius: 2
  }
});
