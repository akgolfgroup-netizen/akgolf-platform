export interface ShotData {
  roundId: string;
  holeId: string;
  holeNumber: number;
  par: number;
  shotNumber: number;
  club: string;
  fromLie: string;
  fromDistance: number;
  toLie: string;
  toDistance: number;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
}
