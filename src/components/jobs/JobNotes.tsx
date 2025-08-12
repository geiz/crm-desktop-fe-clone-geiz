import { useCallback } from 'react';
import { toast } from 'react-toastify';

import NotesWrapper from 'components/Notes/NotesWrapper';

import { JOB_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { addEditNote, deleteNote } from 'store/slices/jobSlice';
import { useAppDispatch } from 'store/store';
import { Method, Note } from 'types/common';

interface NotesProps {
    jobId: string;
    notes: Note[];
    isEditable?: boolean;
}

const JobNotes = ({ jobId, notes = [], isEditable }: NotesProps) => {
    const dispatch = useAppDispatch();

    const handleSaveNote = useCallback(
        (text: string) =>
            apiRequest<Note>({ url: JOB_ENDPOINTS.saveNote(Number(jobId)), method: Method.POST, data: { text } })
                .then(response => {
                    dispatch(addEditNote(response));
                })
                .catch(error => {
                    toast.error(error.message);
                    throw error;
                }),
        [dispatch, jobId]
    );

    const handleUpdateNote = useCallback(
        (id: number, text: string) =>
            apiRequest<Note>({ url: JOB_ENDPOINTS.changeNote(Number(jobId), id), method: Method.PUT, data: { text } })
                .then(response => {
                    dispatch(addEditNote(response));
                })
                .catch(error => {
                    toast.error(error.message);
                    throw error;
                }),
        [dispatch, jobId]
    );

    const handleDeleteNote = useCallback(
        (id: number) =>
            apiRequest<string>({ url: JOB_ENDPOINTS.changeNote(Number(jobId), id), method: Method.DELETE })
                .then(() => {
                    dispatch(deleteNote(id));
                })
                .catch(error => {
                    toast.error(error.message);
                    throw error;
                }),
        [dispatch, jobId]
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

export default JobNotes;
