import React from "react";
import { ScrollView, View, Text, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useMap } from "../../contexts/MapContext";
import ImageList from "../../components/ImageList";

export default function MarkerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    markers,
    addImagesToMarker,
    removeMarker,
    removeImageFromMarker,
    refreshMarkers,
  } = useMap();

  const marker = markers.find((m) => m.id === id);

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      await addImagesToMarker(id!, uris);
      await refreshMarkers();
    }
  };

  if (!marker) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Маркер не найден</Text>
      </SafeAreaView>
    );
  }

  const handleDeleteMarker = () => {
    Alert.alert(
      "Удалить маркер?",
      "Все связанные фотографии также будут удалены.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMarker(Number(marker.id));
              router.back();
            } catch (err) {
              console.error("Ошибка удаления маркера:", err);
              Alert.alert("Ошибка", "Не получилось удалить маркер.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Маркер #{marker.id}</Text>

          <TouchableOpacity onPress={handleDeleteMarker} style={styles.deleteButton}>
            <Text style={{ fontSize: 26 }}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Координаты: {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
        </Text>

        <Button title="Добавить изображение" onPress={addImage} />

        <ImageList
          images={marker.images}
          onDelete={async (uri) => {
            await removeImageFromMarker(marker.id, uri);
            await refreshMarkers();
          }}
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
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: "#EF4444",
    borderRadius: 12,
  },
});
