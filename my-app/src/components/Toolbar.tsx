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

            <Text style={styles.sliderLabel}>Select Cluster Color</Text>
            <ColorPickerWheel
            initialColor={color}
            onColorChange={(selectedColor: string) => setColor(selectedColor)}
            style={styles.colorPicker as any} // Type assertion if needed
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleSaveCluster}>Save</Button>
          </Dialog.Actions>
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
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorPicker: {
    marginTop: 20,
    height: 150,
    width: 150,
  },
});

export default Toolbar;
