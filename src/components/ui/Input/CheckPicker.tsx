import { CheckPicker as RsCheckPicker } from 'rsuite';

import { FC } from 'react';

import type { SelectOption } from 'types/common';

import './CheckPicker.css';
import 'rsuite/CheckPicker/styles/index.css';

interface CheckPickerProps {
    data: SelectOption[];
    value?: (string | number)[];
    onChange?: (value: (string | number)[]) => void;
    placeholder?: string;
}

const CheckPicker: FC<CheckPickerProps> = ({ value, onChange, placeholder, ...props }) => {
    return (
        <RsCheckPicker
            className='custom-checkpicker'
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Select options'}
            {...props}
        />
    );
};

export default CheckPicker;
