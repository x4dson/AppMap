export interface MarkerRow {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface ImageRow {
  id: number;
  marker_id: number;
  uri: string;
  created_at: string;
}
