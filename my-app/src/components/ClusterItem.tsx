import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import { ClusterData, ConnectionData } from './clusterTypes';
import { Button } from 'react-native-paper';

interface ClusterItemProps {
  cluster: ClusterData;
  connections: ConnectionData[];
  onDelete: () => void;
  onCreateNode: (parentId: string) => void;
  onUpdateColor: (id: string, newColor: string) => void;
  onUpdateLabel: (id: string, newLabel: string) => void;
  onToggleExpand: (id: string) => void;
}

export default function ClusterItem({
  cluster,
  connections,
  onDelete,
  onCreateNode,
  onUpdateColor,
  onUpdateLabel,
  onToggleExpand,
}: ClusterItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [labelInputVisible, setLabelInputVisible] = useState(false);
  const [newLabel, setNewLabel] = useState(cluster.label);
  const [tempColor, setTempColor] = useState(cluster.color);

  const { id, label, color, size, xOffset, yOffset, expanded } = cluster;
  const fontSize = Math.max(size * 0.15, 8);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xOffset.value }, { translateY: yOffset.value }],
  }));

  const panGesture = Gesture.Pan().onChange(event => {
    xOffset.value += event.changeX;
    yOffset.value += event.changeY;
  });

  const handleDoubleTap = useCallback((nodeId: string) => {
    onToggleExpand(nodeId);
  }, [onToggleExpand]);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleDoubleTap)(cluster.id);
    });

  const combinedGesture = Gesture.Simultaneous(panGesture, doubleTapGesture);

  const openColorPicker = () => {
    setTempColor(cluster.color);
    setColorPickerVisible(true);
    setModalVisible(false);
  };

  const handleTempColorChange = (newColor: string) => {
    setTempColor(newColor);
  };

  const handleLabelChange = () => {
    if (newLabel.trim()) {
      onUpdateLabel(id, newLabel);
    }
    setLabelInputVisible(false);
  };


  const handleColorChange = (newColor: string) => {
    if (onUpdateColor) {
      onUpdateColor(id, newColor);
    }
    setColorPickerVisible(true);
  };

  return (
    <>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              opacity: expanded ? 1 : 0,
            },
            animatedStyle,
          ]}
        >
          <Pressable
            onLongPress={() => setModalVisible(true)}
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
            <Text style={[styles.label, { fontSize }]}>{label}</Text>
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
              onPress={() => setLabelInputVisible(true)}
            >
            <Text style={styles.modalOptionText}>Edit Label</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={openColorPicker}>
              <Text style={styles.modalOptionText}>Change Color</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                onCreateNode(id);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>Create New Node</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setConfirmationVisible(true)}
            >
              <Text style={styles.modalOptionText}>Delete Node</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
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
              <TouchableOpacity style={styles.confirmButton} onPress={onDelete}>
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmationVisible(false)}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Color Picker Modal */}
      {colorPickerVisible && (
        <View style={styles.colorPickerContainer}>
          <Text style={styles.colorPickerTitle}>Select a New Color</Text>
          <ColorPickerWheel
            initialColor={tempColor}
            onColorChange={handleTempColorChange}
            style={{ height: 200, width: 200 }}
          />
          <Button
            mode="contained"
            onPress={() => {
              onUpdateColor(id, tempColor); // Update node color only when Done is pressed
              setColorPickerVisible(false);
            }}
          >
            Done
          </Button>
        </View>
      )}

      {/* Label Input Modal */}
      {labelInputVisible && (
        <View style={styles.colorPickerContainer}>
          <Text style={styles.colorPickerTitle}>Edit Label</Text>
          <TextInput
            placeholder="Enter Label"
            placeholderTextColor="#888888"
            value={newLabel}
            onChangeText={setNewLabel}
            style={styles.input}
            maxLength={20}
          />
          <Button mode="contained" onPress={handleLabelChange}>
            Done
          </Button>
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
    boxShadow: '1px 1px 10px 0px',
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    zIndex: 11,
    boxShadow: "1px 1px 10px 1px"
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
    color: 'black',
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
  // colorPickerContainer: {
  //   position: 'absolute',
  //   top: '50%',  // Center it vertically
  //   left: '50%',  // Center it horizontally
  //   transform: [{ translateX: -100 }, { translateY: -100 }], // Adjust for positioning
  //   backgroundColor: 'white',
  //   padding: 20,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   width: 250,
  //   height: 250,
  //   elevation: 5,  // Adds shadow on Android
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  //   
  // },
  // colorPickerTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#333',
  //   marginBottom: 15,
  //   textAlign: 'center',
  // },
  colorPickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    position: 'absolute',  // Center it horizontally
    transform: [{ translateX: 60 }, { translateY: 50 }], // Adjust for positioning
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
    height: 400,
    boxShadow: "1px 1px 10px 1px"
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 8,
    color: '#000',
    },
});


// const styles = StyleSheet.create({
//   circle: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 1, height: 1 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   label: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//     zIndex: 11,
//     shadowColor: '#000',
//     shadowOffset: { width: 1, height: 1 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
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
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   confirmationButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//   },
//   confirmButton: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: 'green',
//     borderRadius: 5,
//     marginRight: 5,
//     alignItems: 'center',
//   },
//   confirmButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: 'gray',
//     borderRadius: 5,
//     marginLeft: 5,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   colorPickerContainer: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 15,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: 250,
//     height: 400,
//     shadowColor: '#000',
//     shadowOffset: { width: 1, height: 1 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   colorPickerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     marginBottom: 20,
//     paddingHorizontal: 8,
//     color: '#000',
//   },
// });


