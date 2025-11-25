import React, { createContext, useContext, useEffect, useState } from "react";
import { useDatabase } from "./DatabaseContext";

export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  images: string[];
}

export interface MapContextType {
  markers: MarkerData[];
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  addMarker: (lat: number, lon: number) => Promise<number>;
  addImagesToMarker: (id: string, uris: string[]) => Promise<void>;
  removeImageFromMarker: (id: string, uri: string) => Promise<void>;
  removeMarker: (id: number) => Promise<void>;
  setRegion: (r: any) => void;
  refreshMarkers: () => Promise<void>;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useDatabase();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [region, setRegion] = useState({
    latitude: 55.75,
    longitude: 37.61,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const refreshMarkers = async (): Promise<void> => {
    try {
      const rows = await db.getAllMarkers();
      const withImages: MarkerData[] = [];

      for (const r of rows) {
        const imgs = await db.getImagesForMarker(r.id);
        const uris = Array.isArray(imgs) ? imgs.map((i: any) => i.uri) : [];
        withImages.push({
          id: String(r.id),
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          images: uris,
        });
      }

      setMarkers(withImages);
    } 
    catch (err) {
      console.error("MapContext.refreshMarkers error:", err);
      throw err;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await db.initDatabase();
        await refreshMarkers();
      } 
      catch (err) {
        console.error("MapProvider init error:", err);
      }
    })();
  }, []);

  const addMarkerFn = async (lat: number, lon: number): Promise<number> => {
    try {
      const newId = await db.createMarker(lat, lon);
      // обновим состояние после вставки
      await refreshMarkers();
      return newId;
    } 
    catch (err) {
      console.error("MapContext.addMarker error:", err);
      throw err;
    }
  };

  const addImagesToMarkerFn = async (id: string, uris: string[]): Promise<void> => {
    try {
      const markerId = Number(id);
      for (const uri of uris) {
        await db.addImageToMarker(markerId, uri);
      }
      await refreshMarkers();
    } 
    catch (err) {
      console.error("MapContext.addImagesToMarker error:", err);
      throw err;
    }
  };

  const removeImageFromMarkerFn = async (id: string, uri: string): Promise<void> => {
    try {
      await db.removeImageByUri(uri);
      await refreshMarkers();
    } 
    catch (err) {
      console.error("MapContext.removeImageFromMarker error:", err);
      throw err;
    }
  };

  const removeMarkerFn = async (id: number): Promise<void> => {
    try {
      await db.deleteMarker(id);
      await refreshMarkers();
    } 
    catch (err) {
      console.error("MapContext.removeMarker error:", err);
      throw err;
    }
  };

  return (
    <MapContext.Provider
      value={{
        markers,
        region,
        addMarker: addMarkerFn,
        addImagesToMarker: addImagesToMarkerFn,
        removeImageFromMarker: removeImageFromMarkerFn,
        removeMarker: removeMarkerFn,
        setRegion,
        refreshMarkers,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext)!;
