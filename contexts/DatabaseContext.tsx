import React, { createContext, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { CREATE_IMAGES_TABLE, CREATE_MARKERS_TABLE } from "../database/schema";
import {
  createMarker as dbCreateMarker,
  deleteMarker as dbDeleteMarker,
  getAllMarkers as dbGetAllMarkers,
  getImagesForMarker as dbGetImagesForMarker,
  addImageToMarker as dbAddImageToMarker,
  removeImageByUri as dbRemoveImageByUri,
  getDatabaseInstance,
} from "../database/operations";

type DatabaseContextType = {
  initDatabase: () => Promise<void>;
  createMarker: (lat: number, lon: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getAllMarkers: () => Promise<any[]>;
  getImagesForMarker: (markerId: number) => Promise<any[]>;
  addImageToMarker: (markerId: number, uri: string) => Promise<number>;
  removeImageByUri: (uri: string) => Promise<void>;
  dbInstance: SQLite.SQLiteDatabase | null;
};

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbInstance, setDbInstance] = useState<SQLite.SQLiteDatabase | null>(null);

  const initDatabase = async () => {
    try {
      const db = await getDatabaseInstance();
      // Create tables if not exists
      await db.execAsync(`${CREATE_MARKERS_TABLE}; ${CREATE_IMAGES_TABLE};`);
      setDbInstance(db);
    } catch (err) {
      console.error("Failed to initialize DB:", err);
    }
  };

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        initDatabase,
        createMarker: dbCreateMarker,
        deleteMarker: dbDeleteMarker,
        getAllMarkers: dbGetAllMarkers,
        getImagesForMarker: dbGetImagesForMarker,
        addImageToMarker: dbAddImageToMarker,
        removeImageByUri: dbRemoveImageByUri,
        dbInstance,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext)!;
