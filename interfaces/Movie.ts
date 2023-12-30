export interface Movie {
  Id: number;
  Title: string;
  Key: string;
  OriginalTitle?: string;
  Rating?: string;
  RatingDescription?: any;
  RunTime: string;
  Poster?: string;
  Trailer?: string;
  Director: string;
  Actors?: string[];
  Gender?: string;
  Distributor?: string;
  Order?: number;
  Formats?: any[];
}
