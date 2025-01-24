// ClusterItem.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { ClusterData } from './clusterTypes';

interface Props {
  cluster: ClusterData;
  onDelete: () => void;
  onCreateNode: (parentId: string) => void;
}

/**
 * A single cluster circle with dragging and a modal for "delete" or "create node."
 */
export default function ClusterItem({ cluster, onDelete, onCreateNode }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  // We'll keep track of the start offsets during drag:
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  const { id, label, color, size, xOffset, yOffset } = cluster;

  // Animate the circle's position based on xOffset and yOffset
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xOffset.value },
      { translateY: yOffset.value },
    ],
  }));

  // Drag gesture that updates the SharedValues in real time
  const dragGesture = Gesture.Pan()
    .onStart(() => {
      // Capture the current offset at the start of the gesture
      startXRef.current = xOffset.value;
      startYRef.current = yOffset.value;
    })
    .onUpdate((evt) => {
      // Update the cluster's position in real time
      xOffset.value = evt.translationX + startXRef.current;
      yOffset.value = evt.translationY + startYRef.current;
    });

  const handleLongPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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
            hitSlop={20}
            pressRetentionOffset={20}
          >
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>

      {/* Simple modal overlay for cluster options */}
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
    textAlign: 'center',
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
