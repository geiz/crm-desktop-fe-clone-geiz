import cn from 'classnames';

import TextboxModal from 'components/Modals/TextboxModal';
import NoteItem from 'components/Notes/NoteItem';
import Button from 'components/ui/Button';

import { LENGTH_S } from 'constants/common';
import useModal from 'hooks/useModal';
import { Note } from 'types/common';

import styles from './NotesWrapper.module.css';

interface NotesProps {
    notes: Note[];
    isEditable?: boolean;
    onSaveNote: (text: string) => Promise<void>;
    onUpdateNote: (id: number, newText: string) => Promise<void>;
    onDeleteNote: (id: number) => Promise<void>;
}

const NotesWrapper = ({ notes = [], isEditable = false, onSaveNote, onUpdateNote, onDeleteNote }: NotesProps) => {
    const createNoteModal = useModal();

    return (
        <>
            <div className={styles.notes}>
                {notes.length ? (
                    notes.map(note => (
                        <NoteItem key={note.id} {...note} isEditable={isEditable} onUpdateNote={onUpdateNote} onDeleteNote={onDeleteNote} />
                    ))
                ) : (
                    <div className={cn(styles.noNotes, 'body-14R')}>No notes available</div>
                )}
            </div>
            {isEditable && (
                <Button btnStyle='outlined-s' icon='plus' className={styles.addBtn} onClick={createNoteModal.openModal}>
                    Add Note
                </Button>
            )}

            {createNoteModal.isOpen && (
                <TextboxModal
                    isOpen={createNoteModal.isOpen}
                    onClose={createNoteModal.closeModal}
                    onSave={onSaveNote}
                    title='Add Note'
                    value=''
                    placeholder='Enter note text'
                    maxLength={LENGTH_S}
                />
            )}
        </>
    );
};

export default NotesWrapper;
