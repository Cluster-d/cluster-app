import React from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';


type ClusterProps = {
  label: string;
  color: string;
  size: number;
  defaultX: number;
  defaultY: number;
};

const Cluster = ({ label, color, size, defaultX, defaultY }: ClusterProps) => {
  // Create the shared values via the hook
  const xOffset = useSharedValue(defaultX);
  const yOffset = useSharedValue(defaultY);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xOffset.value },
      { translateY: yOffset.value },
    ],
  }));

  // Basic drag gesture
  const dragGesture = Gesture.Pan()
    .onUpdate((evt) => {
      xOffset.value = evt.translationX + defaultX;
      yOffset.value = evt.translationY + defaultY;
    });

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      >
        <Text style={{ color: '#fff' }}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default Cluster;

