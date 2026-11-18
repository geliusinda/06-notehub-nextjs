import type { Note } from '@/types/note';

export interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  signal?: AbortSignal;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
