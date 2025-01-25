import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toolbar from "@/src/components/Toolbar";

export default function Index() {
  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <View style={styles.container}>
        <Toolbar />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});