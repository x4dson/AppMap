import { Stack } from "expo-router";
import { MapProvider } from "../components/MapContext";

export default function RootLayout() {
  return (
    <MapProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </MapProvider>
  );
}
