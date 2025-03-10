// // clusterTypes.ts
// import { makeMutable, SharedValue } from 'react-native-reanimated';

// export interface ClusterData {
//   id: string;
//   label: string;
//   color: string;
//   size: number;
//   parentId?: string;
//   xOffset: SharedValue<number>;
//   yOffset: SharedValue<number>;
//   children: ClusterData[];
//   fontColor: string;
//   expanded: boolean;
// }
// export interface ConnectionData {
//   parentId: string;
//   childId: string;
// }

// export function createClusterData(
//   id: string,
//   label: string,
//   color: string,
//   size: number,
//   defaultX: number,
//   defaultY: number,
//   parentId?: string,
//   fontColor: string = '#000'
// ): ClusterData {
//   return {
//     id,
//     label,
//     color,
//     size,
//     parentId,
//     xOffset: makeMutable<number>(defaultX),
//     yOffset: makeMutable<number>(defaultY), 
//     children: [],
//     fontColor,
//     expanded: true, 
//   };
// }
import { makeMutable, SharedValue } from 'react-native-reanimated';

export interface ClusterData {
  id: string;
  label: string;
  color: string;
  size: number;
  parentId?: string;
  xOffset: SharedValue<number>;
  yOffset: SharedValue<number>;
  children: ClusterData[];
  fontColor: string;
  expanded: boolean;
}

export interface ConnectionData {
  parentId: string;
  childId: string;
}

export function createClusterData(
  id: string,
  label: string,
  color: string,
  size: number,
  defaultX: number,
  defaultY: number,
  parentId?: string,
  fontColor: string = '#000'
): ClusterData {
  return {
    id,
    label,
    color,
    size,
    parentId,
    xOffset: makeMutable<number>(defaultX),
    yOffset: makeMutable<number>(defaultY),
    children: [],
    fontColor,
    expanded: true,
  };
}
