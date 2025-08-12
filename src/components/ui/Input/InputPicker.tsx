import cn from 'classnames';
import { InputPicker as RsInputPicker } from 'rsuite';

import './InputPicker.css';
import 'rsuite/InlineEdit/styles/index.css';
import 'rsuite/InputPicker/styles/index.css';

interface PickerItem {
    label: string;
    value: string | number;
}

interface InputPickerProps {
    className?: string;
    placeholder?: string;
    data: PickerItem[];
    label?: string;
    value: number | null;
    onChange: (value: number) => void;
    onOpen?: () => void;
    disabled?: boolean;
}

const InputPicker = ({
    className,
    placeholder = 'Click to edit ...',
    data,
    label,
    value,
    onChange,
    onOpen,
    disabled = false
}: InputPickerProps) => <div className={cn('input-picker', className)}>
            {label && (
                <span className={cn('input-picker__label', 'body-14R')}>
                    {label}
                    {disabled ? ' :' : <i className='icon-drop-down-small' />}
                </span>
            )}

            {disabled ? (
                <span className='input-picker__value'>{data[0]?.label}</span>
            ) : (
                    <RsInputPicker 
                    placeholder={placeholder} value={value} onChange={onChange}
                     data={data} onOpen={onOpen} 
                     />
            )}
        </div>;

export default InputPicker;
