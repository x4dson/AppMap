import React from "react";
import MapView, { Marker, MapPressEvent, LongPressEvent } from "react-native-maps";
import { StyleSheet } from "react-native";
import { useMap } from "./MapContext";


export default function Map({ onMarkerPress }: { onMarkerPress: (id: string) => void }) {
  const { markers, addMarker, region, setRegion } = useMap();

  const handleLongPress = (e: MapPressEvent | LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    addMarker(latitude, longitude);
  };

  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      region={region}
      onRegionChangeComplete={setRegion}
      onLongPress={handleLongPress}
    >
      {markers.map((m) => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.latitude, longitude: m.longitude }}
          onPress={() => onMarkerPress(m.id)}
        />
      ))}
    </MapView>
  );
}
