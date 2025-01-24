// clusterTypes.ts
import { makeMutable, SharedValue } from 'react-native-reanimated';

export interface ClusterData {
  id: string;
  label: string;
  color: string;
  size: number;
  parentId?: string;
  xOffset: SharedValue<number>;
  yOffset: SharedValue<number>;
}

export function createClusterData(
  id: string,
  label: string,
  color: string,
  size: number,
  defaultX: number,
  defaultY: number,
  parentId?: string
): ClusterData {
  return {
    id,
    label,
    color,
    size,
    parentId,
    xOffset: makeMutable<number>(defaultX), // <number> here
    yOffset: makeMutable<number>(defaultY), // <number> here
  };
}
