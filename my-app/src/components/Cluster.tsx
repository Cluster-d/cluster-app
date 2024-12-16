import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ClusterProps = {
  label: string;
  color: string;
};

const Cluster = ({ label, color }: ClusterProps) => {
  return (
    <View style={[styles.circle, { backgroundColor: color }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,  // Makes it a circle
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    marginTop: 10,
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Cluster;
