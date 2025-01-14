
// export default Toolbar;
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text } from 'react-native';
import Cluster from './Cluster';
import { Appbar, Button, DefaultTheme, Provider as PaperProvider, Dialog, Portal } from 'react-native-paper';
import ColorPickerWheel from 'react-native-color-picker-wheel';

type ClusterType = {
  id: string;
  label: string;
  color: string;
  size: number;
};

const Toolbar = () => {
  const [clusters, setClusters] = useState<ClusterType[]>([]);
  const [label, setLabel] = useState<string>('');
  const [color, setColor] = useState<string>('#ff0000');
  const [size, setSize] = useState<number>(100); 
  const [visible, setVisible] = useState<boolean>(false);

  const handleCreateCluster = () => setVisible(true);

  const handleSaveCluster = () => {
    if (label.trim()) {
      const newCluster: ClusterType = {
        id: Date.now().toString(),
        label,
        color,
        size,
      };

      setClusters([...clusters, newCluster]);

      setLabel('');
      setSize(100);
      console.log('Cluster Props:', { label, color, size });
    }
    setVisible(false);
  };

  const handleDeleteCluster = (id: string) => {
    setClusters((prevClusters) => prevClusters.filter((cluster) => cluster.id !== id));
    console.log(`Deleted cluster with id: ${id}`);
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Toolbar" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        <Button
          mode="contained"
          onPress={handleCreateCluster}
          style={{ marginRight: 10 }}
        >
          New Cluster
        </Button>
      </Appbar.Header>

      <View style={styles.container}>
        <FlatList
          data={clusters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Cluster
              label={item.label}
              color={item.color}
              size={item.size}
              onDelete={() => handleDeleteCluster(item.id)} // Pass delete handler
            />
          )}
        />
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Create Cluster</Dialog.Title>
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
              style={styles.colorPicker as any} // Type assertion if needed
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  sliderLabel: {
    flex: 0,
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
    justifyContent: 'center', // Center buttons horizontally
    alignItems: 'center', // Center buttons vertically if needed
  },
  actionButton: {
    marginHorizontal: 10, // Add space between buttons
  },
});

export default Toolbar;
