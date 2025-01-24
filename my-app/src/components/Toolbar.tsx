// import React, { useState } from 'react';
// import { View, StyleSheet, TextInput, FlatList, Text } from 'react-native';
// import Cluster from './Cluster';
// import {
//   Appbar,
//   Button,
//   DefaultTheme,
//   Provider as PaperProvider,
//   Dialog,
//   Portal,
// } from 'react-native-paper';
// import ColorPickerWheel from 'react-native-color-picker-wheel';
// import Svg, { Line } from 'react-native-svg';

// type ClusterType = {
//   id: string;
//   label: string;
//   color: string;
//   size: number;
//   x: number; // x-coordinate for positioning
//   y: number; // y-coordinate for positioning
//   parentId?: string; // Reference to the parent cluster
// };

// const Toolbar = () => {
//   const [clusters, setClusters] = useState<ClusterType[]>([]);
//   const [label, setLabel] = useState<string>('');
//   const [color, setColor] = useState<string>('#ff0000');
//   const [size, setSize] = useState<number>(100);
//   const [visible, setVisible] = useState<boolean>(false);
//   const [parentId, setParentId] = useState<string | null>(null);

//   // Open dialog to create a brand-new (root) cluster
//   const handleCreateCluster = () => {
//     setParentId(null); // no parent
//     setVisible(true);
//   };

//   // Open dialog to create a child node of an existing cluster
//   const handleCreateNode = (parentId: string) => {
//     setParentId(parentId);
//     setVisible(true);
//   };

//   // Save a new cluster (root or child)
//   const handleSaveCluster = () => {
//     if (label.trim()) {
//       const parent = clusters.find((cluster) => cluster.id === parentId);

//       const newCluster: ClusterType = {
//         id: Date.now().toString(),
//         label,
//         color,
//         size,
//         // Position child near its parent, otherwise random for root
//         x: parent ? parent.x + 150 : Math.random() * 300,
//         y: parent ? parent.y + 150 : Math.random() * 300,
//         parentId: parentId || undefined,
//       };

//       setClusters([...clusters, newCluster]);

//       // Reset form
//       setLabel('');
//       setColor('#ff0000');
//       setSize(100);
//       setVisible(false);
//     }
//   };

//   // Delete a cluster
//   const handleDeleteCluster = (id: string) => {
//     setClusters((prevClusters) => prevClusters.filter((cluster) => cluster.id !== id));
//   };

//   // When a cluster finishes dragging, update its position in state
//   const handleDragEnd = (id: string, newX: number, newY: number) => {
//     setClusters((prev) =>
//       prev.map((cluster) =>
//         cluster.id === id
//           ? { ...cluster, x: newX, y: newY }
//           : cluster
//       )
//     );
//   };

//   return (
//     <PaperProvider theme={DefaultTheme}>
//       {/* App Bar */}
//       <Appbar.Header>
//         <Appbar.BackAction onPress={() => {}} />
//         <Appbar.Content title="Toolbar" />
//         <Appbar.Action icon="dots-vertical" onPress={() => {}} />
//         <Button
//           mode="contained"
//           onPress={handleCreateCluster}
//           style={{ marginRight: 10 }}
//         >
//           New Cluster
//         </Button>
//       </Appbar.Header>

//       {/* Main Container */}
//       <View style={styles.container}>
//         {/* SVG for Lines */}
//         <Svg style={StyleSheet.absoluteFill}>
//           {clusters
//             .filter((cluster) => cluster.parentId)
//             .map((cluster) => {
//               const parent = clusters.find((c) => c.id === cluster.parentId);
//               if (!parent) return null;
//               return (
//                 <Line
//                   key={`line-${cluster.id}`}
//                   x1={parent.x + parent.size / 2}
//                   y1={parent.y + parent.size / 2}
//                   x2={cluster.x + cluster.size / 2}
//                   y2={cluster.y + cluster.size / 2}
//                   stroke="black"
//                   strokeWidth={2}
//                 />
//               );
//             })}
//         </Svg>

//         {/* Render all clusters */}
//         {clusters.map((cluster) => (
//           <Cluster
//             key={cluster.id}
//             id={cluster.id}
//             label={cluster.label}
//             color={cluster.color}
//             size={cluster.size}
//             x={cluster.x}
//             y={cluster.y}
//             onDelete={() => handleDeleteCluster(cluster.id)}
//             onCreateNode={handleCreateNode}
//             onDragEnd={handleDragEnd} // <-- New prop for updating position
//           />
//         ))}
//       </View>

//       {/* Dialog for creating clusters/nodes */}
//       <Portal>
//         <Dialog visible={visible} onDismiss={() => setVisible(false)}>
//           <Dialog.Title>
//             {parentId ? 'Create New Node' : 'Create Cluster'}
//           </Dialog.Title>
//           <Dialog.Content>
//             <TextInput
//               placeholder="Enter Cluster Label"
//               value={label}
//               onChangeText={setLabel}
//               style={styles.input}
//             />
//             <Text style={styles.sliderLabel}>Select Color</Text>
//             <ColorPickerWheel
//               initialColor={color}
//               onColorChange={(selectedColor: string) => setColor(selectedColor)}
//               style={{ marginTop: 20, height: 150, width: 150 }}
//               animationConfig={{ useNativeDriver: true }} 
//             />
//             <View style={styles.buttonContainer}>
//               <Button onPress={() => setVisible(false)} style={styles.actionButton}>
//                 Cancel
//               </Button>
//               <Button onPress={handleSaveCluster} style={styles.actionButton}>
//                 Save
//               </Button>
//             </View>
//           </Dialog.Content>
//         </Dialog>
//       </Portal>
//     </PaperProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'relative', // for absolutely positioned clusters
//   },
//   input: {
//     height: 40,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     marginBottom: 10,
//     paddingHorizontal: 8,
//   },
//   sliderLabel: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   actionButton: {
//     marginHorizontal: 10,
//   },
// });

// export default Toolbar;

// Toolbar.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
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
// If you don't have `uuid`, install with `yarn add uuid` or `npm install uuid`
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { ClusterData, createClusterData } from './clusterTypes';
import ClusterItem from './ClusterItem';
import LinkLine from './LinkLine';

/**
 * Main screen that manages an array of clusters, plus the modal for adding new ones.
 */
export default function Toolbar() {
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#ff0000');
  const [size, setSize] = useState(100);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  /** Create a root-level cluster (no parent) */
  const handleCreateCluster = () => {
    setParentId(null);
    setDialogVisible(true);
  };

  /** Open dialog to create a child node of an existing cluster */
  const handleCreateNode = (clusterId: string) => {
    setParentId(clusterId);
    setDialogVisible(true);
  };

  /** Once user taps "Save", create the new cluster or node */
  const handleSaveCluster = () => {
    if (!label.trim()) return;

    const id = uuidv4(); // unique ID
    // If there's a parent, position near it; otherwise random
    const parentCluster = clusters.find((c) => c.id === parentId);
    const defaultX = parentCluster ? parentCluster.xOffset.value + 150 : Math.random() * 300;
    const defaultY = parentCluster ? parentCluster.yOffset.value + 150 : Math.random() * 300;

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

    // Reset form
    setLabel('');
    setColor('#ff0000');
    setSize(100);
    setDialogVisible(false);
  };

  /** Delete a cluster (and you could also remove children if you want) */
  const handleDeleteCluster = (id: string) => {
    setClusters((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Toolbar" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />

        <Button mode="contained" onPress={handleCreateCluster} style={{ marginRight: 10 }}>
          New Cluster
        </Button>
      </Appbar.Header>

      <View style={styles.container}>
        {/* All lines go in the SVG layer. Each parent->child pair gets a <LinkLine>. */}
        <Svg style={StyleSheet.absoluteFill}>
          {clusters
            .filter((child) => child.parentId)
            .map((child) => {
              const parent = clusters.find((c) => c.id === child.parentId);
              if (!parent) return null;
              return <LinkLine key={`line-${child.id}`} parent={parent} child={child} />;
            })}
        </Svg>

        {/* Render all clusters. Each cluster can be dragged in real time. */}
        {clusters.map((cluster) => (
          <ClusterItem
            key={cluster.id}
            cluster={cluster}
            onDelete={() => handleDeleteCluster(cluster.id)}
            onCreateNode={handleCreateNode}
          />
        ))}
      </View>

      {/* Dialog for creating a cluster or node */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{parentId ? 'Create Node' : 'Create Cluster'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder="Enter Label"
              value={label}
              onChangeText={setLabel}
              style={styles.input}
            />
            <Text style={styles.sliderLabel}>Select Color</Text>
            <ColorPickerWheel
              initialColor={color}
              onColorChange={(selectedColor: string) => setColor(selectedColor)}
              style={{ marginTop: 20, height: 150, width: 150 }}
              animationConfig={{ useNativeDriver: true }} // prevent old Animated warning
            />
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
  container: {
    flex: 1,
    position: 'relative',
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
    textAlign: 'center',
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
