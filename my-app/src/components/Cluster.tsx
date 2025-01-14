import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';

type ClusterProps = {
  label: string;
  color: string;
  size: number;
  onDelete: () => void;
};

const Cluster = ({ label, color, onDelete }: ClusterProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    setModalVisible(true); // Show the modal on long press
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <>
      <Pressable
        onLongPress={handleLongPress}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
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
                closeModal();
              }}
            >
              <Text style={styles.modalOptionText}>New Node</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={closeModal}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 75,
    height: 75,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
