import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Map from "../components/Map";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Map onMarkerPress={(id) => router.push(`/marker/${id}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
