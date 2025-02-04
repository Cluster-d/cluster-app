// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
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

//   const { id, label, color, size, xOffset, yOffset } = cluster;
 
//   // Animated style
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [
//       { translateX: xOffset.value },
//       { translateY: yOffset.value },
//     ],
//   }));

//     const dragGesture = Gesture.Pan().onChange(event => {
//       xOffset.value += event.changeX;
//       yOffset.value += event.changeY;
//     });

//   const handleLongPress = () => setModalVisible(true);
//   const closeModal = () => setModalVisible(false);

//   const youSure = () => {

//   }

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
//             hitSlop={10}
//             pressRetentionOffset={10}
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

import React, { useState } from 'react';
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
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const { id, label, color, size, xOffset, yOffset } = cluster;

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xOffset.value },
      { translateY: yOffset.value },
    ],
  }));

  const dragGesture = Gesture.Pan().onChange(event => {
    xOffset.value += event.changeX;
    yOffset.value += event.changeY;
  });

  const handleLongPress = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Handles the confirmation prompt
  const youSure = () => {
    setModalVisible(false);
    setConfirmationVisible(true); // Show confirmation modal
  };

  const confirmDelete = () => {
    onDelete();
    setConfirmationVisible(false); // Close confirmation modal after deletion
  };

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
            hitSlop={10}
            pressRetentionOffset={10}
          >
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>

      {/* Options Modal */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options for {label}</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={youSure} // Trigger confirmation prompt
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

      {/* Confirmation Modal */}
      {confirmationVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to delete this?</Text>

            <View style={styles.confirmationButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDelete}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmationVisible(false)}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
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
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
