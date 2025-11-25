import * as SQLite from "expo-sqlite";
import { CREATE_IMAGES_TABLE, CREATE_MARKERS_TABLE } from "./schema";

let _db: SQLite.SQLiteDatabase | null = null;

export const getDatabaseInstance = async (): Promise<SQLite.SQLiteDatabase> => {
  if (_db) return _db;
  // openDatabaseAsync is available in modern expo-sqlite
  // If not available in older versions, you may need to fallback to openDatabaseSync()
  // but for current Expo, openDatabaseAsync exists.
  // @ts-ignore
  _db = await SQLite.openDatabaseAsync("markers.db");
  return _db!;
};

export const initDatabaseIfNeeded = async () => {
  try {
    const db = await getDatabaseInstance();
    await db.execAsync(`${CREATE_MARKERS_TABLE}; ${CREATE_IMAGES_TABLE};`);
  } catch (err) {
    console.error("initDatabaseIfNeeded error:", err);
    throw err;
  }
};

export const createMarker = async (latitude: number, longitude: number): Promise<number> => {
  const db = await getDatabaseInstance();
  try {
    const res = await db.runAsync(
      "INSERT INTO markers (latitude, longitude) VALUES (?, ?)",
      latitude,
      longitude
    );
    // res.lastInsertRowId is the inserted id
    return Number(res.lastInsertRowId);
  } catch (err) {
    console.error("createMarker error:", err);
    throw err;
  }
};

export const deleteMarker = async (markerId: number): Promise<void> => {
  const db = await getDatabaseInstance();
  try {
    await db.runAsync("DELETE FROM marker_images WHERE marker_id = ?", markerId);
    await db.runAsync("DELETE FROM markers WHERE id = ?", markerId);
  } catch (err) {
    console.error("deleteMarker error:", err);
    throw err;
  }
};

export const getAllMarkers = async (): Promise<any[]> => {
  const db = await getDatabaseInstance();
  try {
    const rows = await db.getAllAsync("SELECT * FROM markers ORDER BY id DESC");
    return rows;
  } catch (err) {
    console.error("getAllMarkers error:", err);
    throw err;
  }
};

export const getImagesForMarker = async (markerId: number): Promise<any[]> => {
  const db = await getDatabaseInstance();
  try {
    const rows = await db.getAllAsync(
      "SELECT * FROM marker_images WHERE marker_id = ? ORDER BY id DESC",
      markerId
    );
    return rows;
  } catch (err) {
    console.error("getImagesForMarker error:", err);
    throw err;
  }
};

export const addImageToMarker = async (markerId: number, uri: string): Promise<number> => {
  const db = await getDatabaseInstance();
  try {
    const res = await db.runAsync(
      "INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)",
      markerId,
      uri
    );
    return Number(res.lastInsertRowId);
  } catch (err) {
    console.error("addImageToMarker error:", err);
    throw err;
  }
};

export const removeImageByUri = async (uri: string): Promise<void> => {
  const db = await getDatabaseInstance();
  try {
    await db.runAsync("DELETE FROM marker_images WHERE uri = ?", uri);
  } catch (err) {
    console.error("removeImageByUri error:", err);
    throw err;
  }
};
