import type { AxiosResponse } from 'axios';
import type { Note, NewNote } from '@/types/note';
import type { FetchNotesParams, FetchNotesResponse } from './api/types';
import api from './api/client';

export async function fetchNotes({
  page,
  perPage = 12,
  search = '',
  signal,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await api.get('/notes', {
    params: { page, perPage, search },
    signal,
  });
  return response.data;
}
export async function createNote(note: NewNote): Promise<Note> {
  const response: AxiosResponse<Note> = await api.post('/notes', note);
  return response.data;
}
export async function deleteNote(id: Note['id']): Promise<Note> {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById(
  id: Note['id'],
  signal?: AbortSignal,
): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${encodeURIComponent(id)}`, {
    signal,
  });
  return data;
}
