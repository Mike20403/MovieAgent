export interface ErrorPayload {
  message?: string;
  status?: number;
  [key: string]: unknown;
}
