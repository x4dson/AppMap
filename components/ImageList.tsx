import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  images: string[];
  onDelete: (uri: string) => void;
}

export default function ImageList({ images, onDelete }: Props) {
  if (!images.length) {
    return (
      <Text style={styles.emptyText}>Нет добавленных изображений</Text>
    );
  }

  return (
    <View style={styles.grid}>
      {images.map((uri) => (
        <View key={uri} style={styles.card}>
          <Image source={{ uri }} style={styles.image} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(uri)}
          >
            <Text style={styles.deleteText}>Удалить 🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginVertical: 16,
  },
});
