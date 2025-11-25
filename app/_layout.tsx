import { Stack } from "expo-router";
import { DatabaseProvider } from "../contexts/DatabaseContext";
import { MapProvider } from "../contexts/MapContext";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <MapProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </MapProvider>
    </DatabaseProvider>
  );
}
