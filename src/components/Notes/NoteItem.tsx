import cn from 'classnames';

import { useCallback } from 'react';

import DeleteModal from 'components/Modals/DeleteModal';
import TextboxModal from 'components/Modals/TextboxModal';
import Button from 'components/ui/Button';
import Tooltip from 'components/ui/Tooltip';

import { DATE_TIME_FORMAT, LENGTH_S } from 'constants/common';
import useModal from 'hooks/useModal';
import useTimezone from 'hooks/useTimezone';
import { Note } from 'types/common';

import styles from './NoteItem.module.css';

interface Props extends Note {
    isEditable: boolean;
    onUpdateNote: (id: number, newText: string) => Promise<void>;
    onDeleteNote: (id: number) => Promise<void>;
}

const NoteItem = ({ id, createdAt, text, isEditable, onUpdateNote, onDeleteNote }: Props) => {
    const editModal = useModal();
    const confirmDeleteModal = useModal();
    const { getTimezonedFormatedDate } = useTimezone();

    const handleEditNote = useCallback((newText: string) => onUpdateNote(id, newText), [id, onUpdateNote]);

    const handleDeleteConfirm = useCallback(() => onDeleteNote(id), [id, onDeleteNote]);

    return (
        <>
            <div className={styles.note}>
                <div className={styles.header}>
                    <div className={cn(styles.createdAt, 'body-12R')}>{getTimezonedFormatedDate(createdAt, DATE_TIME_FORMAT)}</div>
                    {isEditable && (
                        <Tooltip text='Edit'>
                            <Button btnStyle='icon-btn' className={cn(styles.iconBtn, 'icon-edit')} onClick={editModal.openModal} />
                        </Tooltip>
                    )}
                    {isEditable && (
                        <Tooltip text='Delete'>
                            <Button
                                btnStyle='icon-btn'
                                className={cn(styles.trash, styles.iconBtn, 'icon-trash')}
                                onClick={confirmDeleteModal.openModal}
                            />
                        </Tooltip>
                    )}
                </div>
                <div className={cn(styles.text, 'body-14R')}>{text}</div>
            </div>
            {editModal.isOpen && (
                <TextboxModal
                    isOpen={editModal.isOpen}
                    onClose={editModal.closeModal}
                    onSave={handleEditNote}
                    title='Edit Note'
                    value={text}
                    placeholder='Enter note text'
                    maxLength={LENGTH_S}
                />
            )}

            <DeleteModal
                isOpen={confirmDeleteModal.isOpen}
                onClose={confirmDeleteModal.closeModal}
                onConfirm={handleDeleteConfirm}
                itemName='this note'
            />
        </>
    );
};

export default NoteItem;
