import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Text, Dimensions } from 'react-native';
import { Appbar, Button, DefaultTheme, Provider as PaperProvider, Dialog, Portal, Menu, } from 'react-native-paper';
import Svg from 'react-native-svg';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { ClusterData, createClusterData } from './clusterTypes';
import ClusterItem from './ClusterItem';
import LinkLine from './LinkLine';
import tinycolor from 'tinycolor2'; // To lighten the color progressively

export default function Toolbar() {
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#ff0000');
  const [size, setSize] = useState(100);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // History for undo/redo
  const history = useRef<ClusterData[][]>([]);
  const historyIndex = useRef<number>(-1);

  // Function to open the menu
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Handle Undo
  const handleUndo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      setClusters([...history.current[historyIndex.current]]);
    }
    closeMenu();
  };

  // Handle Redo
  const handleRedo = () => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current += 1;
      setClusters([...history.current[historyIndex.current]]);
    }
    closeMenu();
  };

  // Save clusters state to history
  const saveToHistory = (newClusters: ClusterData[]) => {
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(newClusters);
    historyIndex.current += 1;
  };

  // Handle Convert to List
  const handleConvertToList = () => {
    console.log('Convert to List pressed');
    closeMenu();
  };

  // Open dialog for new clusters
  const handleCreateCluster = () => {
    setParentId(null);
    setDialogVisible(true);
  };

  // Open dialog for new nodes
  const handleCreateNode = (parentId: string) => {
    setParentId(parentId);
    setDialogVisible(true);
  };

  const handleSaveCluster = () => {
    if (!label.trim()) return;
  
    const id = uuidv4();
    const parentCluster = clusters.find((c) => c.id === parentId);
  
    const { width, height } = Dimensions.get('window');
  
    // Calculate default positions
    const centerX = width / 2 - size / 2;
    const centerY = height / 2 - size / 2;
  
    // Determine position based on parent
    const defaultX = parentCluster ? parentCluster.xOffset.value + 100 : centerX;
    const defaultY = parentCluster ? parentCluster.yOffset.value + 100 : centerY;
  
    // **Determine color (inherit and lighten progressively)**
    const newColor = parentCluster
      ? tinycolor(parentCluster.color).lighten(10).toHexString()
      : color;
  
    // **Determine size (inherit and shrink progressively)**
    const newSize = parentCluster
      ? Math.max(parentCluster.size * 0.9, 50) // Reduce size by 10%, but not below 20
      : size;
  
    const newCluster = createClusterData(
      id,
      label.trim(),
      newColor, // Lightened color
      newSize,  // Reduced size
      defaultX,
      defaultY,
      parentId || undefined
    );
  
    const newClusters = [...clusters, newCluster];
    setClusters(newClusters);
    saveToHistory(newClusters);
  
    setLabel('');
    setColor('#ff0000'); // Reset color picker
    setSize(100); // Reset size to default
    setDialogVisible(false);
  };
  // Delete cluster and all its children
  const handleDeleteCluster = (id: string) => {
    setClusters((prevClusters) => {
      const nodesToDelete = new Set([id]);

      const findChildrenToDelete = (parentId: string) => {
        prevClusters.forEach((cluster) => {
          if (cluster.parentId === parentId) {
            nodesToDelete.add(cluster.id);
            findChildrenToDelete(cluster.id);
          }
        });
      };

      findChildrenToDelete(id);
      const newClusters = prevClusters.filter((cluster) => !nodesToDelete.has(cluster.id));
      saveToHistory(newClusters);
      return newClusters;
    });
  };

  const handleUpdateColor = (id: string, newColor: string) => {
    console.log(`Updating color for cluster ${id} to ${newColor}`);
    setClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, color: newColor } : cluster
      )
    );
  };

  const handleUpdateLabel = (id: string, newLabel: string) => {
    setClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, label: newLabel } : cluster
      )
    );
  };
  
  return (
    <PaperProvider theme={DefaultTheme}>
      <Appbar.Header style={styles.header}>
        <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<Appbar.Action icon="menu" onPress={openMenu} />}>
          <Menu.Item onPress={handleUndo} title="Undo" leadingIcon="undo" />
          <Menu.Item onPress={handleRedo} title="Redo" leadingIcon="redo" />
          <Menu.Item onPress={handleConvertToList} title="Convert to List" leadingIcon="format-list-bulleted" />
        </Menu>

        <Button mode="contained" onPress={handleCreateCluster} style={styles.newClusterButton}>
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
            onUpdateColor={handleUpdateColor}
            onUpdateLabel={handleUpdateLabel}  
          />
        ))}
      </View>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialogContainer}>
          <Dialog.Content>
            <View style={styles.dialogContainer}>
              <Text style={styles.dialogTitle}>{parentId ? 'Create Node' : 'Create Cluster'}</Text>
              <TextInput
                placeholder="Enter Label"
                placeholderTextColor="#888888"
                value={label}
                onChangeText={setLabel}
                style={styles.input}
                maxLength={20}
              />
              <View style={styles.colorPickerContainer}>
                <Text style={styles.sliderLabel}>Select Node Color</Text>
                <ColorPickerWheel
                  initialColor={color}
                  onColorChange={setColor}
                  style={styles.colorPicker}
                  animationConfig={{ useNativeDriver: true }}
                />
                <Text style={styles.fontColor}>Select Font Color</Text>
                <View style={styles.buttonContainer}>
                <Button onPress={() => setDialogVisible(false)} style={styles.blackButton}>
                  Black
                </Button>
                <Button onPress={handleSaveCluster} style={styles.whiteButton}>
                  White
                </Button>
              </View>
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
      zIndex: 15,
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
      height: '99%',
      justifyContent: 'flex-start',
      borderRadius: 20,
      backgroundColor: '#ffffff',
    },
    dialogTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000',
      marginBottom: 0,
    },
    fontColor: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000',
      marginTop: 10,
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
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 0,
    },
    colorPickerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    colorPicker: {
      height: 250,
      width: 250,
      marginBottom: 10,
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
    blackButton: {
      marginHorizontal: 10,
      backgroundColor: '#000', // Black background
      borderRadius: 25,
    },
    
    blackButtonText: {
      color: '#fff', 
      fontWeight: 'bold',
      textAlign: 'center',
    },
    
    whiteButton: {
      marginHorizontal: 10,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 25,
    },
    
    whiteButtonText: {
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  