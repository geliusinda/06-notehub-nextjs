import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
export const dynamic = 'force-dynamic';
export default async function Notes() {
  const client = new QueryClient();
  const queryKey = ['notes', 1, ''];
  await client.prefetchQuery({
    queryKey,
    queryFn: () => fetchNotes({ page: 1, search: '' }),
  });
  const error = client.getQueryState(queryKey)?.error;
  if (error) throw error;
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
