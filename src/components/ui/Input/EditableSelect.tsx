import cn from 'classnames';

import { forwardRef, useEffect, useState } from 'react';

import { SelectOption } from 'types/common';

import styles from './EditableSelect.module.css';

export interface EditableSelectProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: SelectOption | null;
    onChange?: (value: SelectOption) => void;
    onFocus?: () => void;
    errorMessage?: string;
    isLoading?: boolean;
    className?: string;
    disabled?: boolean;
}

const EditableSelect = forwardRef<HTMLInputElement, EditableSelectProps>(
    (
        {
            label,
            placeholder = 'Select or type value',
            options,
            value,
            onChange,
            onFocus,
            errorMessage,
            isLoading = false,
            className,
            disabled = false
        },
        ref
    ) => {
        const [inputValue, setInputValue] = useState<string>('');
        const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

        useEffect(() => {
            if (value) {
                setInputValue(value.label);
            }
        }, [value]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            onChange?.({ value: newValue, label: newValue });
        };

        const handleInputFocus = () => {
            onFocus?.();
            setIsDropdownOpen(true);
        };

        const handleInputBlur = () => {
            setTimeout(() => setIsDropdownOpen(false), 200);
        };

        const handleDropdownToggle = () => {
            if (!disabled) {
                onFocus?.();
                setIsDropdownOpen(!isDropdownOpen);
            }
        };

        const handleOptionClick = (option: SelectOption) => {
            setInputValue(option.label);
            onChange?.(option);
            setIsDropdownOpen(false);
        };

        return (
            <div className={cn(styles.editableSelect, className)}>
                {label && <label className={cn(styles.label, 'body-12R')}>{label}</label>}
                <div className={styles.inputWrapper}>
                    <input
                        ref={ref}
                        className={cn(styles.editableInput, 'body-16R', {
                            [styles.error]: errorMessage,
                            [styles.disabled]: disabled
                        })}
                        type='text'
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        disabled={disabled}
                    />
                    <button
                        type='button'
                        className={cn(styles.dropdownButton, { [styles.open]: isDropdownOpen })}
                        onClick={handleDropdownToggle}
                        disabled={disabled}>
                        {isLoading ? <i className='icon-spinner' /> : <i className='icon-drop-down' />}
                    </button>
                    {isDropdownOpen && options.length > 0 && (
                        <div className={styles.dropdownMenu}>
                            {options.map(option => (
                                <div
                                    key={option.value}
                                    className={cn(styles.dropdownItem, 'body-14M')}
                                    onClick={() => handleOptionClick(option)}>
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {errorMessage && <span className={cn(styles.errorMessage, 'body-12R')}>{errorMessage}</span>}
            </div>
        );
    }
);

EditableSelect.displayName = 'EditableSelect';

export default EditableSelect;
