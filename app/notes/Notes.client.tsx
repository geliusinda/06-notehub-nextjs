'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './Notes.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 300);
  const query = useQuery({
    queryKey: ['notes', page, search],
    queryFn: ({ signal }) => fetchNotes({ page, search, signal }),
    throwOnError: true,
    placeholderData: keepPreviousData,
  });
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    updateSearch(event.target.value);
  };
  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={input} onChange={handleSearch} />
        {query.data && query.data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={query.data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>
      {query.isPending && <p role="status">Loading, please wait...</p>}
      {query.isSuccess && query.data.notes.length === 0 && (
        <p role="status">
          {search
            ? 'No notes match your search.'
            : 'No notes yet. Create your first note!'}
        </p>
      )}
      {!!query.data?.notes.length && (
        <NoteList
          notes={query.data.notes}
          disabled={query.isPlaceholderData}
          onDeleted={() => {
            if (query.data?.notes.length === 1 && page > 1) setPage(page - 1);
          }}
        />
      )}
      {isOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onCancel={closeModal}
            onSuccess={() => {
              updateSearch.cancel();
              setInput('');
              setSearch('');
              setPage(1);
              closeModal();
            }}
          />
        </Modal>
      )}
    </main>
  );
}
