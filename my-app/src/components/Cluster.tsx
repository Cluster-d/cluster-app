import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated'; // Only use reanimated here

type ClusterProps = {
  id: string;
  label: string;
  color: string;
  size: number;
  x: number;
  y: number;
  onDelete: () => void;
  onCreateNode: (parentId: string) => void;
};

const Cluster = ({ id, label, color, size, x, y, onDelete, onCreateNode }: ClusterProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const xOffset = useSharedValue(x);
  const yOffset = useSharedValue(y);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xOffset.value }, { translateY: yOffset.value }],
  }));

  const dragGesture = Gesture.Pan()
    .onUpdate((event) => {
      xOffset.value = event.translationX + x;
      yOffset.value = event.translationY + y;
    })
    .onEnd(() => {
      xOffset.value = xOffset.value;
      yOffset.value = yOffset.value;
    });

  const handleLongPress = () => {
    setModalVisible(true); // Open modal on long press
  };

  const closeModal = () => {
    setModalVisible(false); // Close modal
  };

  return (
    <>
      {/* Draggable and pressable cluster */}
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
            animatedStyle,
          ]}
        >
          <Pressable
            onLongPress={handleLongPress}
            style={({ pressed }) => [
              styles.circle,
              {
                backgroundColor: pressed ? 'lightgray' : color,
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
            hitSlop={20}
            pressRetentionOffset={20}
          >
            <Text style={styles.label}>{label}</Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>

      {/* Modal for options */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options for {label}</Text>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onDelete();
                closeModal();
              }}
            >
              <Text style={styles.modalOptionText}>Delete Cluster</Text>
            </TouchableOpacity>

            {/* New Node Button */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onCreateNode(id);
                closeModal();
              }}
            >
              <Text style={styles.modalOptionText}>Create New Node</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    color: 'black',
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

export default Cluster;






