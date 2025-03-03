import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Text, Dimensions } from 'react-native';
import {
  Appbar,
  Button,
  DefaultTheme,
  Provider as PaperProvider,
  Dialog,
  Portal,
  Menu,
} from 'react-native-paper';
import Svg from 'react-native-svg';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { ClusterData, ConnectionData, createClusterData } from './clusterTypes';
import ClusterItem from './ClusterItem';
import LinkLine from './LinkLine';
import tinycolor from 'tinycolor2';

interface ToolbarProps {
  clusters?: ClusterData[];
  connections: ConnectionData[];
}

export default function Toolbar({
  clusters: initialClusters = [],
  connections = [],
}: ToolbarProps) {
  const [clusters, setClusters] = useState<ClusterData[]>(initialClusters);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#ff0000');
  const [size, setSize] = useState(100);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // History for undo/redo
  const history = useRef<ClusterData[][]>([]);
  const historyIndex = useRef<number>(-1);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleUndo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      setClusters([...history.current[historyIndex.current]]);
    }
    closeMenu();
  };

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

  const handleConvertToList = () => {
    console.log('Convert to List pressed');
    closeMenu();
  };

  const handleCreateCluster = () => {
    setParentId(null);
    setDialogVisible(true);
  };

  const handleCreateNode = (parentId: string) => {
    setParentId(parentId);
    setDialogVisible(true);
  };

  const handleSaveCluster = () => {
    if (!label.trim()) return;
    const id = uuidv4();
    const parentCluster = clusters.find((c) => c.id === parentId);
    const { width, height } = Dimensions.get('window');
    const centerX = width / 2 - size / 2;
    const centerY = height / 2 - size / 2;

    // Determine position based on parent
    const defaultX = parentCluster ? parentCluster.xOffset.value + 100 : centerX;
    const defaultY = parentCluster ? parentCluster.yOffset.value + 100 : centerY;

    // Inherit and progressively lighten color if node, else use selected color
    const newColor = parentCluster
      ? tinycolor(parentCluster.color).lighten(10).toHexString()
      : color;

    // Inherit and shrink size for nodes (minimum 50)
    const newSize = parentCluster ? Math.max(parentCluster.size * 0.9, 50) : size;

    const newCluster = createClusterData(
      id,
      label.trim(),
      newColor,
      newSize,
      defaultX,
      defaultY,
      parentId || undefined
    );

    const newClusters = [...clusters, newCluster];
    setClusters(newClusters);
    saveToHistory(newClusters);

    // Reset form
    setLabel('');
    setColor('#ff0000');
    setSize(100);
    setDialogVisible(false);
  };

  // Delete cluster and its children recursively
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
      const newClusters = prevClusters.filter(
        (cluster) => !nodesToDelete.has(cluster.id)
      );
      saveToHistory(newClusters);
      return newClusters;
    });
  };

  const handleUpdateColor = (id: string, newColor: string) => {
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

  
  const handleToggleExpand = (id: string) => {
    setClusters((prevClusters) => {
      // Get all immediate children of the tapped node.
      const children = prevClusters.filter((cluster) => cluster.parentId === id);
      // Determine if they are all currently hidden.
      const allHidden = children.every((child) => !child.expanded);
      // Toggle: if all are hidden, set them to visible; otherwise, hide them.
      return prevClusters.map((cluster) => {
        if (cluster.parentId === id) {
          return { ...cluster, expanded: allHidden ? true : false };
        }
        return cluster;
      });
    });
  };
  

  // Helper to determine if a node is visible (the node itself and all its ancestors must be expanded)
  function isNodeVisible(cluster: ClusterData, allClusters: ClusterData[]): boolean {
    // If the node itself isn't expanded, it's not visible
    if (!cluster.expanded) return false;

    // If no parent, just return the node's expanded state
    if (!cluster.parentId) return cluster.expanded;

    // Otherwise, check the parent
    const parent = allClusters.find((c) => c.id === cluster.parentId);
    if (!parent) return cluster.expanded; // or false if you prefer

    // Recursively check the parent chain
    return cluster.expanded && isNodeVisible(parent, allClusters);
  }

  return (
    <PaperProvider theme={DefaultTheme}>
      <Appbar.Header style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
        >
          <Menu.Item onPress={handleUndo} title="Undo" leadingIcon="undo" />
          <Menu.Item onPress={handleRedo} title="Redo" leadingIcon="redo" />
          <Menu.Item
            onPress={handleConvertToList}
            title="Convert to List"
            leadingIcon="format-list-bulleted"
          />
        </Menu>
        <Button mode="contained" onPress={handleCreateCluster} style={styles.newClusterButton}>
          New Cluster
        </Button>
      </Appbar.Header>

      <View style={styles.fullContainer}>
        {/* Render lines only for child nodes that are visible and have a visible parent */}
        <Svg style={StyleSheet.absoluteFill}>
          {clusters
            .filter((child) => child.parentId && isNodeVisible(child, clusters))
            .map((child) => {
              const parent = clusters.find((c) => c.id === child.parentId);
              // Also check if the parent is visible
              if (!parent || !isNodeVisible(parent, clusters)) return null;
              return <LinkLine key={`line-${child.id}`} parent={parent} child={child} />;
            })}
        </Svg>

        {/* Render only visible clusters */}
        {clusters
          .filter((c) => isNodeVisible(c, clusters))
          .map((cluster) => (
            <ClusterItem
              key={cluster.id}
              cluster={cluster}
              connections={connections}
              onDelete={() => handleDeleteCluster(cluster.id)}
              onCreateNode={handleCreateNode}
              onUpdateColor={handleUpdateColor}
              onUpdateLabel={handleUpdateLabel}
              onToggleExpand={handleToggleExpand}
            />
          ))}
      </View>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialogContainer}
        >
          <Dialog.Content style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.dialogTitle}>
                {parentId ? 'Create Node' : 'Create Cluster'}
              </Text>
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
  // Full container for both lines and nodes
  fullContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  dialogContainer: {
    height: '80%',
    justifyContent: 'flex-start',
    borderRadius: 20,
    backgroundColor: '#ccd6d9',
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 0,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 8,
    color: '#000',
  },
  colorPickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
  },
  colorPicker: {
    height: 250,
    width: 250,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
  },
  actionButton: {
    marginHorizontal: 10,
  },
});


// const styles = StyleSheet.create({
//   header: {
//     width: Dimensions.get('window').width,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     backgroundColor: '#bbcacf',
//     zIndex: 15,
//   },
//   newClusterButton: {
//     backgroundColor: '#1e81b0',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   dialogContainer: {
//     height: '80%',
//     justifyContent: 'flex-start',
//     borderRadius: 20,
//     backgroundColor: '#ccd6d9',
//   },
//   dialogTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#000',
//     marginBottom: 0,
//   },
//   fontColor: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#000',
//     marginTop: 10,
//   },
//   input: {
//     height: 40,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     marginBottom: 20,
//     paddingHorizontal: 8,
//     color: '#000',
//   },
//   sliderLabel: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 0,
//   },
//   colorPickerContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   colorPicker: {
//     height: 250,
//     width: 250,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 0,
//   },
//   actionButton: {
//     marginHorizontal: 10,
//   },
//   blackButton: {
//     marginHorizontal: 10,
//     backgroundColor: '#000', // Black background
//     borderRadius: 25,
//   },
  
//   blackButtonText: {
//     color: '#fff', 
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
  
//   whiteButton: {
//     marginHorizontal: 10,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 25,
//   },
  
//   whiteButtonText: {
//     color: '#000',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });