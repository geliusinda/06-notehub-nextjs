import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from '../NoteDetails.client';
export default async function NoteDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = new QueryClient();
  const queryKey = ['note', id];
  await client.prefetchQuery({ queryKey, queryFn: () => fetchNoteById(id) });
  const error = client.getQueryState(queryKey)?.error;
  if (error) throw error;
  return (
    <HydrationBoundary state={dehydrate(client)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
