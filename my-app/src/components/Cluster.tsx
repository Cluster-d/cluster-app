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





// // Cluster.tsx

// import React, { useRef } from 'react';
// import { Text, StyleSheet } from 'react-native';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

// interface ClusterProps {
//   label: string;
//   color: string;
//   size: number;
//   initialX: number;
//   initialY: number;
// }

// /**
//  * A simple draggable cluster circle.
//  */
// const Cluster: React.FC<ClusterProps> = React.memo(({ label, color, size, initialX, initialY }) => {
//   // Ensure initialX and initialY are numbers, default to 0
//   const safeInitialX = initialX ?? 0;
//   const safeInitialY = initialY ?? 0;

//   // Shared values for position
//   const x = useSharedValue(safeInitialX);
//   const y = useSharedValue(safeInitialY);

//   // Refs to store the starting position
//   const startX = useRef(0);
//   const startY = useRef(0);

//   // Animated style
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: x.value },
//       { translateY: y.value },
//     ],
//   }));

//   // Pan Gesture for dragging
//   const panGesture = Gesture.Pan()
//     .onStart(() => {
//       // Capture the current position at the start of the gesture
//       startX.current = x.value;
//       startY.current = y.value;
//     })
//     .onUpdate((event) => {
//       // Update the position based on the gesture's translation
//       x.value = startX.current + event.translationX;
//       y.value = startY.current + event.translationY;
//     });

//   return (
//     <GestureDetector gesture={panGesture}>
//       <Animated.View
//         style={[
//           styles.circle,
//           {
//             width: size,
//             height: size,
//             borderRadius: size / 2,
//             backgroundColor: color,
//           },
//           animatedStyle,
//         ]}
//       >
//         <Text style={styles.label}>{label}</Text>
//       </Animated.View>
//     </GestureDetector>
//   );
// });

// const styles = StyleSheet.create({
//   circle: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5, // Adds shadow for Android
//     shadowColor: '#000', // Adds shadow for iOS
//     shadowOffset: { width: 0, height: 2 }, // iOS shadow
//     shadowOpacity: 0.3, // iOS shadow
//     shadowRadius: 3, // iOS shadow
//   },
//   label: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Cluster;
