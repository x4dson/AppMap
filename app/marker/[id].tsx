import React from "react";
import { ScrollView, View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useMap } from "../../components/MapContext";
import ImageList from "../../components/ImageList";

export default function MarkerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { markers, addImagesToMarker, removeImageFromMarker } = useMap();
  const marker = markers.find((m) => m.id === id);

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      addImagesToMarker(id!, uris);
    }
  };

  if (!marker) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Маркер не найден</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Маркер #{marker.id}</Text>
        <Text style={styles.subtitle}>
          Координаты: {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
        </Text>

        <Button title="Добавить изображение" onPress={addImage} />

        <ImageList
          images={marker.images}
          onDelete={(uri) => removeImageFromMarker(marker.id, uri)}
        />

        <Button title="Назад к карте" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
});
