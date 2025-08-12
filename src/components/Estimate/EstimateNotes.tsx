import { useCallback } from 'react';
import { toast } from 'react-toastify';

import NotesWrapper from 'components/Notes/NotesWrapper';

import { apiRequest } from 'services/apiUtils';
import { addEditNote, deleteNote } from 'store/slices/estimateSlice';
import { useAppDispatch } from 'store/store';
import { Method, Note } from 'types/common';

interface NotesProps {
    estimateId: string;
    notes: Note[];
    isEditable?: boolean;
}

const EstimateNotes = ({ estimateId, notes = [], isEditable }: NotesProps) => {
    const dispatch = useAppDispatch();

    const handleSaveNote = useCallback(
        (text: string) =>
            apiRequest<Note>({ url: `/estimates/${estimateId}/notes`, method: Method.POST, data: { text } })
                .then(response => {
                    dispatch(addEditNote(response));
                })
                .catch(error => {
                    toast.error(error.message);
                    throw error;
                }),
        [dispatch, estimateId]
    );

    const handleUpdateNote = useCallback(
        (id: number, text: string) =>
            apiRequest<Note>({ url: `/estimates/${estimateId}/notes/${id}`, method: Method.PUT, data: { text } })
                .then(response => {
                    dispatch(addEditNote(response));
                })
                .catch(error => {
                    toast.error(error.message);
                    throw error;
                }),
        [dispatch, estimateId]
    );

    const handleDeleteNote = useCallback(
        (id: number) =>
            apiRequest<string>({ url: `/estimates/${estimateId}/notes/${id}`, method: Method.DELETE })
                .then(() => {
                    dispatch(deleteNote(id));
                })
                .catch(error => {
                    toast.error(error.message);
                    throw error;
                }),
        [dispatch, estimateId]
    );

    return (
        <NotesWrapper
            notes={notes}
            isEditable={isEditable}
            onSaveNote={handleSaveNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
        />
    );
};

export default EstimateNotes;
