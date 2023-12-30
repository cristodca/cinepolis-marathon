import { MovieDate } from "./Date";

export interface Cinema {
  Key: string;
  Name: string;
  CityKey?: string;
  CityName?: string;
  Status?: number;
  Id: number;
  Dates?: MovieDate[];
  VistaId?: string;
  IsPresale?: boolean;
  Children?: string;
  Order?: number;
  TimeZoneDifference?: number;
}
