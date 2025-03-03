// // LinkLine.tsx
// import React from 'react';
// import { Line } from 'react-native-svg';
// import Animated, { useAnimatedProps } from 'react-native-reanimated';
// import { ClusterData } from './clusterTypes';

// // Convert regular <Line> into an animated component
// const AnimatedLine = Animated.createAnimatedComponent(Line);

// interface LinkLineProps {
//   parent: ClusterData;
//   child: ClusterData;
// }

// /**
//  * Draws a real-time updating line between a parent and child cluster.
//  */
// export default function LinkLine({ parent, child }: LinkLineProps) {
//   // Reanimated "props" that update automatically based on shared values
//   const animatedProps = useAnimatedProps(() => ({
//     x1: parent.xOffset.value + parent.size / 2,
//     y1: parent.yOffset.value + parent.size / 2,
//     x2: child.xOffset.value + child.size / 2,
//     y2: child.yOffset.value + child.size / 2,
//   }));

//   return (
//     <AnimatedLine
//       animatedProps={animatedProps}
//       stroke="black"
//       strokeWidth={2}
//     />
//   );
// }



import React from 'react';
import { Line } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { ClusterData } from './clusterTypes';

const AnimatedLine = Animated.createAnimatedComponent(Line);

interface LinkLineProps {
  parent: ClusterData;
  child: ClusterData;
}

export default function LinkLine({ parent, child }: LinkLineProps) {
  // Only render the line if the child node is visible
  if (!child.expanded) return null;

  const animatedProps = useAnimatedProps(() => ({
    x1: parent.xOffset.value + parent.size / 2,
    y1: parent.yOffset.value + parent.size / 2,
    x2: child.xOffset.value + child.size / 2,
    y2: child.yOffset.value + child.size / 2,
  }));

  return (
    <AnimatedLine
      animatedProps={animatedProps}
      stroke="black"
      strokeWidth={2}
    />
  );
}
