import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, Dimensions } from 'react-native';
import {
  Appbar,
  Button,
  DefaultTheme,
  Provider as PaperProvider,
  Dialog,
  Portal,
} from 'react-native-paper';
import Svg from 'react-native-svg';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { ClusterData, createClusterData } from './clusterTypes';
import ClusterItem from './ClusterItem';
import LinkLine from './LinkLine';

export default function Toolbar() {
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#ff0000');
  const [size, setSize] = useState(100);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const handleCreateCluster = () => {
    setParentId(null);
    setDialogVisible(true);
  };

  const handleCreateNode = (clusterId: string) => {
    setParentId(clusterId);
    setDialogVisible(true);
  };

  const handleSaveCluster = () => {
    if (!label.trim()) return;

    const id = uuidv4();
    const parentCluster = clusters.find((c) => c.id === parentId);
    // const defaultX = parentCluster ? parentCluster.xOffset.value + 150 : Math.random() * 300;
    // const defaultY = parentCluster ? parentCluster.yOffset.value + 150 : Math.random() * 300;
    const { width, height } = Dimensions.get('window');
    // Calculate default positions
    const centerX = width / 2 - size / 2; // Center horizontally, accounting for cluster size
    const centerY = height / 2 - size / 2; // Center vertically, accounting for cluster size

    // Determine cluster position based on whether there's a parent
    const defaultX = parentCluster ? parentCluster.xOffset.value + 100 : centerX;
    const defaultY = parentCluster ? parentCluster.yOffset.value + 100 : centerY;



    const newCluster = createClusterData(
      id,
      label.trim(),
      color,
      size,
      defaultX,
      defaultY,
      parentId || undefined
    );

    setClusters((prev) => [...prev, newCluster]);
    setLabel('');
    setColor('#ff0000');
    setSize(100);
    setDialogVisible(false);
  };

  const handleDeleteCluster = (id: string) => {
    setClusters((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => console.log('Menu pressed')} />
        <Button
          mode="contained"
          onPress={handleCreateCluster}
          style={styles.newClusterButton}
        >
          New Cluster
        </Button>
      </Appbar.Header>

      <View style={styles.container}>
        <Svg style={StyleSheet.absoluteFill}>
          {clusters
            .filter((child) => child.parentId)
            .map((child) => {
              const parent = clusters.find((c) => c.id === child.parentId);
              if (!parent) return null;
              return <LinkLine key={`line-${child.id}`} parent={parent} child={child} />;
            })}
        </Svg>
        {clusters.map((cluster) => (
          <ClusterItem
            key={cluster.id}
            cluster={cluster}
            onDelete={() => handleDeleteCluster(cluster.id)}
            onCreateNode={handleCreateNode}
          />
        ))}
      </View>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialogContainer}
        >
          <Dialog.Content>
            <View style={styles.dialogContainer}>
              <Text style={styles.dialogTitle}>{parentId ? 'Create Node' : 'Create Cluster'}</Text>
              <TextInput
                placeholder="Enter Label"
                placeholderTextColor="#888888"
                value={label}
                onChangeText={setLabel}
                style={styles.input}
              />
              <View style={styles.colorPickerContainer}>
                <Text style={styles.sliderLabel}>Select Color</Text>
            
                <ColorPickerWheel
                  initialColor={color}
                  onColorChange={(selectedColor: string) => setColor(selectedColor)}
                  style={styles.colorPicker}
                  animationConfig={{ useNativeDriver: true }}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button onPress={() => setDialogVisible(false)} style={styles.actionButton}>
                  Cancel
                </Button>
                <Button onPress={handleSaveCluster} style={styles.actionButton}>
                  Save
                </Button>
              </View>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#bbcacf',
  },
  newClusterButton: {
    backgroundColor: '#1e81b0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dialogContainer: {
    height: '95%',
    justifyContent: 'flex-start',
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 8,
    color: '#000',
  },
  sliderLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  colorPickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPicker: {
    height: 250,
    width: 250,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButton: {
    marginHorizontal: 10,
    color: '#000',
  },
});
