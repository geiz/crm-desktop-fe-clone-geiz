import cn from 'classnames';

import { Controller, useForm } from 'react-hook-form';

import Button from 'components/ui/Button';
import Textarea from 'components/ui/Input/Textarea';

import { LENGTH_S } from 'constants/common';
import { PaymentFormValues } from 'types/invoiceTypes';

import styles from './Cells.module.css';

interface NoteFormProps {
    onSubmit: (data: Partial<PaymentFormValues>) => void;
    defaultValue: string;
    isLoading: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, defaultValue, isLoading }) => {
    const { handleSubmit, control } = useForm({ defaultValues: { note: defaultValue }, mode: 'onChange' });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('body-14M', styles.popoverChildren, styles.form)}>
            <Controller
                name='note'
                control={control}
                render={({ field }) => (
                    <Textarea {...field} rows={3} textbox label={defaultValue ? 'Edit note' : 'Add note'} maxLength={LENGTH_S} />
                )}
            />
            <Button icon='save' area-label='save' btnStyle='outlined-s' isLoading={isLoading} className={styles.saveBtn} />
        </form>
    );
};

export default NoteForm;
