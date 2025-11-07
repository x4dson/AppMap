import React, { createContext, useContext, useState } from "react";

export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  images: string[];
}

interface MapContextType {
  markers: MarkerData[];
  region: any;
  addMarker: (lat: number, lon: number) => void;
  addImagesToMarker: (id: string, uris: string[]) => void;
  removeImageFromMarker: (id: string, uri: string) => void;
  setRegion: (r: any) => void;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [region, setRegion] = useState({
    latitude: 55.75,
    longitude: 37.61,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const addMarker = (lat: number, lon: number) => {
    const newMarker: MarkerData = {
      id: Date.now().toString(),
      latitude: lat,
      longitude: lon,
      images: [],
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  const addImagesToMarker = (id: string, uris: string[]) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, images: [...m.images, ...uris] } : m
      )
    );
  };

  const removeImageFromMarker = (id: string, uri: string) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, images: m.images.filter((i) => i !== uri) } : m
      )
    );
  };

  return (
    <MapContext.Provider
      value={{ markers, region, addMarker, addImagesToMarker, removeImageFromMarker, setRegion }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext)!;
