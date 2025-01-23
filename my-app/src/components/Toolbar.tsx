// Toolbar.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text } from 'react-native';
import Cluster from './Cluster';
import { Appbar, Button, DefaultTheme, Provider as PaperProvider, Dialog, Portal } from 'react-native-paper';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import Svg, { Line } from 'react-native-svg';

type ClusterType = {
  id: string;
  label: string;
  color: string;
  size: number;
  x: number; // X-coordinate for positioning
  y: number; // Y-coordinate for positioning
  parentId?: string; // Reference to the parent cluster
};

const Toolbar = () => {
  const [clusters, setClusters] = useState<ClusterType[]>([]);
  const [label, setLabel] = useState<string>('');
  const [color, setColor] = useState<string>('#ff0000');
  const [size, setSize] = useState<number>(100);
  const [visible, setVisible] = useState<boolean>(false);
  const [parentId, setParentId] = useState<string | null>(null); // Parent ID for new nodes

  // Opens the cluster creation dialog
  const handleCreateCluster = () => {
    setParentId(null); // No parent for new clusters
    setVisible(true);
  };

  // Opens the dialog for creating a new node
  const handleCreateNode = (parentId: string) => {
    setParentId(parentId);
    setVisible(true);
  };

  // Handles saving a new cluster or node
  const handleSaveCluster = () => {
    if (label.trim()) {
      const parent = clusters.find((cluster) => cluster.id === parentId);

      const newCluster: ClusterType = {
        id: Date.now().toString(),
        label,
        color,
        size,
        x: parent ? parent.x + 150 : Math.random() * 300, // Position new nodes near the parent
        y: parent ? parent.y + 150 : Math.random() * 300,
        parentId: parentId || undefined,
      };

      setClusters([...clusters, newCluster]);

      // Reset state after saving
      setLabel('');
      setSize(100);
      setVisible(false);
    }
  };

  // Deletes a cluster
  const handleDeleteCluster = (id: string) => {
    setClusters((prevClusters) => prevClusters.filter((cluster) => cluster.id !== id));
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      {/* App Bar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Toolbar" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        <Button mode="contained" onPress={handleCreateCluster} style={{ marginRight: 10 }}>
          New Cluster
        </Button>
      </Appbar.Header>

      {/* Main Container */}
      <View style={styles.container}>
        {/* SVG for Lines */}
        <Svg style={StyleSheet.absoluteFill}>
          {clusters
            .filter((cluster) => cluster.parentId)
            .map((cluster) => {
              const parent = clusters.find((c) => c.id === cluster.parentId);
              if (!parent) return null;
              return (
                <Line
                  key={`line-${cluster.id}`}
                  x1={parent.x + parent.size / 2}
                  y1={parent.y + parent.size / 2}
                  x2={cluster.x + cluster.size / 2}
                  y2={cluster.y + cluster.size / 2}
                  stroke="black"
                  strokeWidth={2}
                />
              );
            })}
        </Svg>

        {/* Render Clusters */}
        {clusters.map((cluster) => (
          <Cluster
            key={cluster.id}
            id={cluster.id}
            label={cluster.label}
            color={cluster.color}
            size={cluster.size}
            x={cluster.x}
            y={cluster.y}
            onDelete={() => handleDeleteCluster(cluster.id)}
            onCreateNode={handleCreateNode}
          />
        ))}
      </View>

      {/* Cluster Creation Dialog */}
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{parentId ? 'Create New Node' : 'Create Cluster'}</Dialog.Title>
          <Dialog.Content>
          <TextInput
              placeholder="Enter Cluster Label"
              value={label}
              onChangeText={setLabel}
              style={styles.input}
            />
            <Text style={styles.sliderLabel}>Select Color</Text>
            <ColorPickerWheel
              initialColor={color}
              onColorChange={(selectedColor: string) => setColor(selectedColor)}
              style={{ marginTop: 20, height: 150, width: 150 }} // Use inline or compatible styles
            />
            <View style={styles.buttonContainer}>
              <Button onPress={() => setVisible(false)} style={styles.actionButton}>
                Cancel
              </Button>
              <Button onPress={handleSaveCluster} style={styles.actionButton}>
                Save
              </Button>
            </View>
          </Dialog.Content>

        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Allows absolute positioning of clusters
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  sliderLabel: {
    // flex: 0,
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  colorPicker: {
    marginTop: 20,
    height: 150,
    width: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    marginHorizontal: 10,
  },
});

export default Toolbar;






