// // ClusterItem.tsx
// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { useAnimatedStyle } from 'react-native-reanimated';
// import { ClusterData } from './clusterTypes';

// interface ClusterItemProps {
//   cluster: ClusterData;      // { id, label, color, size, xOffset, yOffset }
//   onDelete: () => void;
//   onCreateNode: (parentId: string) => void;
// }

// /**
//  * A single draggable cluster circle.
//  */
// export default function ClusterItem({
//   cluster,
//   onDelete,
//   onCreateNode,
// }: ClusterItemProps) {
//   const [modalVisible, setModalVisible] = useState(false);

//   // Refs to track the finger's offset from the circle's top-left
//   const touchOffsetXRef = useRef(0);
//   const touchOffsetYRef = useRef(0);

//   const { id, label, color, size, xOffset, yOffset } = cluster;

//   // Animated style
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: xOffset.value },
//       { translateY: yOffset.value },
//     ],
//   }));

//   // Pan gesture that keeps the same offset under your finger
//   const dragGesture = Gesture.Pan()
//     .onStart((evt) => {
//       touchOffsetXRef.current = evt.absoluteX - xOffset.value;
//       touchOffsetYRef.current = evt.absoluteY - yOffset.value;
//     })
//     .onUpdate((evt) => {
//       xOffset.value = evt.absoluteX - touchOffsetXRef.current;
//       yOffset.value = evt.absoluteY - touchOffsetYRef.current;
//     });

//   const handleLongPress = () => setModalVisible(true);
//   const closeModal = () => setModalVisible(false);

//   return (
//     <>
//       <GestureDetector gesture={dragGesture}>
//         <Animated.View
//           style={[
//             styles.circle,
//             {
//               width: size,
//               height: size,
//               borderRadius: size / 2,
//               backgroundColor: color,
//             },
//             animatedStyle,
//           ]}
//         >
//           <Pressable
//             onLongPress={handleLongPress}
//             style={({ pressed }) => [
//               styles.circle,
//               {
//                 width: size,
//                 height: size,
//                 borderRadius: size / 2,
//                 backgroundColor: pressed ? 'lightgray' : color,
//               },
//             ]}
//             hitSlop={20}
//             pressRetentionOffset={20}
//           >
//             <Text style={styles.label}>{label}</Text>
//           </Pressable>
//         </Animated.View>
//       </GestureDetector>

//       {modalVisible && (
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Options for {label}</Text>

//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 onDelete();
//                 closeModal();
//               }}
//             >
//               <Text style={styles.modalOptionText}>Delete Cluster</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 onCreateNode(id);
//                 closeModal();
//               }}
//             >
//               <Text style={styles.modalOptionText}>Create New Node</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
//               <Text style={styles.modalCloseText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   circle: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   label: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   modalOption: {
//     width: '100%',
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   modalOptionText: {
//     fontSize: 16,
//   },
//   modalClose: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: 'red',
//     borderRadius: 5,
//     alignItems: 'center',
//     width: '100%',
//   },
//   modalCloseText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });



import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { ClusterData } from './clusterTypes';

interface ClusterItemProps {
  cluster: ClusterData;      // { id, label, color, size, xOffset, yOffset }
  onDelete: () => void;
  onCreateNode: (parentId: string) => void;
}

/**
 * A single draggable cluster circle.
 */
export default function ClusterItem({
  cluster,
  onDelete,
  onCreateNode,
}: ClusterItemProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Refs to track the cluster’s “start position” when the gesture begins
  const touchOffsetXRef = useRef(0);
  const touchOffsetYRef = useRef(0);

  const { id, label, color, size, xOffset, yOffset } = cluster;

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xOffset.value },
      { translateY: yOffset.value },
    ],
  }));

  // Pan gesture that uses relative translation
  const dragGesture = Gesture.Pan()
    .onStart(() => {
      // Capture cluster’s current offset at the start of the gesture
      touchOffsetXRef.current = xOffset.value;
      touchOffsetYRef.current = yOffset.value;
    })
    .onUpdate((evt) => {
      // Move the cluster by adding the finger's relative translation
      xOffset.value = touchOffsetXRef.current + evt.translationX;
      yOffset.value = touchOffsetYRef.current + evt.translationY;
    });

  const handleLongPress = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
            animatedStyle,
          ]}
        >
          <Pressable
            onLongPress={handleLongPress}
            style={({ pressed }) => [
              styles.circle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: pressed ? 'lightgray' : color,
              },
            ]}
            hitSlop={20}
            pressRetentionOffset={20}
          >
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options for {label}</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onDelete();
                closeModal();
              }}
            >
              <Text style={styles.modalOptionText}>Delete Cluster</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onCreateNode(id);
                closeModal();
              }}
            >
              <Text style={styles.modalOptionText}>Create New Node</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalClose: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
  },
});



// // ClusterItem.tsx

// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

// interface ClusterData {
//   id: string;
//   label: string;
//   color: string;
//   size: number;
//   initialX: number;
//   initialY: number;
// }

// interface ClusterItemProps {
//   cluster: ClusterData;
//   onDelete: (id: string) => void;
//   onCreateNode: (parentId: string) => void;
// }

// /**
//  * A single draggable cluster circle with long-press modal options.
//  */
// const ClusterItem: React.FC<ClusterItemProps> = React.memo(({ cluster, onDelete, onCreateNode }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   // Ensure initialX and initialY are numbers, default to 0
//   const initialX = cluster.initialX ?? 0;
//   const initialY = cluster.initialY ?? 0;

//   // Shared values for position
//   const x = useSharedValue(initialX);
//   const y = useSharedValue(initialY);

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

//   // Long Press Gesture for opening modal
//   const longPressGesture = Gesture.LongPress()
//     .minDuration(500)
//     .onStart(() => {
//       setModalVisible(true);
//     });

//   // Combine Pan and Long Press Gestures
//   const composedGesture = Gesture.Simultaneous(panGesture, longPressGesture);

//   // Handler to close modal
//   const closeModal = () => setModalVisible(false);

//   return (
//     <>
//       <GestureDetector gesture={composedGesture}>
//         <Animated.View
//           style={[
//             styles.circle,
//             {
//               width: cluster.size,
//               height: cluster.size,
//               borderRadius: cluster.size / 2,
//               backgroundColor: cluster.color,
//             },
//             animatedStyle,
//           ]}
//         >
//           <Text style={styles.label}>{cluster.label}</Text>
//         </Animated.View>
//       </GestureDetector>

//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={closeModal}
//       >
//         <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={closeModal}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Options for {cluster.label}</Text>

//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 onDelete(cluster.id);
//                 closeModal();
//               }}
//             >
//               <Text style={styles.modalOptionText}>Delete Cluster</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => {
//                 onCreateNode(cluster.id);
//                 closeModal();
//               }}
//             >
//               <Text style={styles.modalOptionText}>Create New Node</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
//               <Text style={styles.modalCloseText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </>
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
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 25,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//     elevation: 10, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 2 }, // iOS shadow
//     shadowOpacity: 0.3, // iOS shadow
//     shadowRadius: 4, // iOS shadow
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   modalOption: {
//     width: '100%',
//     padding: 12,
//     marginVertical: 5,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   modalOptionText: {
//     fontSize: 16,
//   },
//   modalClose: {
//     marginTop: 15,
//     padding: 12,
//     backgroundColor: '#ff4d4d',
//     borderRadius: 6,
//     alignItems: 'center',
//     width: '100%',
//   },
//   modalCloseText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default ClusterItem;
