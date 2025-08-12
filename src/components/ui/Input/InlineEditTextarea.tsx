import { InlineEdit, Input } from 'rsuite';

import { FC, useEffect, useState } from 'react';

import './InlineEditTextarea.css';
import 'rsuite/InlineEdit/styles/index.css';
import 'rsuite/Input/styles/index.css';

interface InlineEditTextareaProps {
    initialValue: string;
    onSave: (value: string | null) => void;
}

const InlineEditTextarea: FC<InlineEditTextareaProps> = ({ initialValue, onSave }) => {
    const [draftValue, setDraftValue] = useState(null);

    useEffect(() => {
        if (initialValue) setDraftValue(initialValue);
    }, [initialValue]);

    const handleChange = (newValue: string) => {
        setDraftValue(newValue);
    };

    const handleSave = () => {
        const finalValue = draftValue.trim() !== '' ? draftValue.trim() : null;
        onSave(finalValue);
    };

    const handleCancel = () => {
        setDraftValue(initialValue);
    };

    return (
        <InlineEdit
            placeholder='Click to edit ...'
            style={{ width: 'auto' }}
            value={draftValue}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}>
            <Input as='textarea' rows={2} />
        </InlineEdit>
    );
};

export default InlineEditTextarea;
