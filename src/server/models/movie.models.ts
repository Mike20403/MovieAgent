export type MovieQueryResponse = {
  name: string;
  id: number;
  rating: number;
  plot: string | null;
  runtime: number;
  genre: string;
  metascore: number | null;
  directors: string | null;
  stars: string | null;
  votes: number | null;
  gross: number | null;
};

export type Recommendation = MovieQueryResponse[]

export type ClassifyIntentOutput = {
  label: string;
  score: number;
} | undefined;
