// import React from 'react';
// import { View, Button, Text, StyleSheet } from 'react-native';
// import { Pressable } from 'react-native-gesture-handler';

// type ClusterProps = {
//   label: string;
//   color: string;
//   size: number;
// };

// const Cluster = ({ label, color }: ClusterProps) => {
//   return (
//     <Pressable
//       style={({ pressed }) => (pressed ? styles.highlight : styles.pressable)}
//       hitSlop={20}
//       pressRetentionOffset={20}>
//         <View style={[styles.circle, { backgroundColor: color }]}>
//           <Text style={styles.label}>{label}</Text>
//         </View>
//     </Pressable>
    
//   );
// };

// const styles = StyleSheet.create({
//   circle: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,  // Makes it a circle
//     justifyContent: 'center', // Centers content vertically
//     alignItems: 'center', // Centers content horizontally
//     marginTop: 10,
//   },
//   label: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default Cluster;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

type ClusterProps = {
  label: string;
  color: string;
  size: number;
};

const Cluster = ({ label, color }: ClusterProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.circle,
        { backgroundColor: pressed ? 'lightgray' : color },
      ]}
      hitSlop={20}
      pressRetentionOffset={20}
    >
      <View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes it a circle
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    marginTop: 10,
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Cluster;
