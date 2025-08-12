import cn from 'classnames';

import { useEffect, useRef, useState } from 'react';

import { SelectOption } from 'types/common';

import styles from './EditableMultiSelect.module.css';

export interface EditableMultiSelectProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value: SelectOption[];
    onChange: (value: SelectOption[]) => void;
    onFocus?: () => void;
    errorMessage?: string;
    isLoading?: boolean;
    className?: string;
    disabled?: boolean;
    tooltipText?: string;
}

const EditableMultiSelect = ({
    label,
    placeholder = 'Add item...',
    options,
    value = [],
    onChange,
    onFocus,
    errorMessage,
    isLoading = false,
    className,
    disabled = false,
    tooltipText
}: EditableMultiSelectProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(
        option =>
            !value.some(selected => selected.value === option.value || selected.label === option.label) &&
            option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        if (editingIndex !== null && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingIndex]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsDropdownOpen(newValue.length > 0 || filteredOptions.length > 0);
    };

    const handleInputFocus = () => {
        onFocus?.();
        setIsDropdownOpen(true);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addItem(inputValue.trim());
        } else if (e.key === 'Escape') {
            setIsDropdownOpen(false);
            setInputValue('');
        }
    };

    const addItem = (itemName: string) => {
        if (itemName && !value.some(item => item.label === itemName)) {
            const newItem = { value: itemName, label: itemName };
            onChange([...value, newItem]);
            setInputValue('');
            setIsDropdownOpen(false);
        }
    };

    const removeItem = (index: number) => {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
    };

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditValue(value[index].label);
    };

    const finishEditing = () => {
        if (editingIndex !== null && editValue.trim()) {
            const newValue = [...value];
            newValue[editingIndex] = { value: editValue.trim(), label: editValue.trim() };
            onChange(newValue);
        }
        setEditingIndex(null);
        setEditValue('');
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishEditing();
        } else if (e.key === 'Escape') {
            setEditingIndex(null);
            setEditValue('');
        }
    };

    const selectOption = (option: SelectOption) => {
        addItem(option.label);
    };

    return (
        <div className={cn(styles.container, className)}>
            {label && (
                <label className={cn(styles.label, 'body-12R')}>
                    {label}
                    {tooltipText && <span className={cn(styles.tooltipIcon, 'icon-info')} title={tooltipText} />}
                </label>
            )}

            <div
                className={cn(styles.selectContainer, {
                    [styles.error]: errorMessage,
                    [styles.disabled]: disabled
                })}>
                {/* Selected items as chips */}
                <div className={styles.chipsContainer}>
                    {value.map((item, index) => (
                        <div key={index} className={styles.chip}>
                            {editingIndex === index ? (
                                <input
                                    ref={editInputRef}
                                    className={cn(styles.editInput, 'body-12M')}
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onBlur={finishEditing}
                                    onKeyDown={handleEditKeyDown}
                                    disabled={disabled}
                                />
                            ) : (
                                <span
                                    className={cn(styles.chipText, 'body-12M')}
                                    onClick={() => !disabled && startEditing(index)}
                                    title='Click to edit'>
                                    {item.label}
                                </span>
                            )}
                            <button
                                type='button'
                                className={styles.removeButton}
                                onClick={() => removeItem(index)}
                                disabled={disabled}
                                title='Remove item'>
                                <i className='icon-close-l' />
                            </button>
                        </div>
                    ))}

                    {/* Input for adding new items */}
                    <div className={styles.inputWrapper}>
                        <input
                            ref={inputRef}
                            className={cn(styles.input, 'body-16R')}
                            type='text'
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onKeyDown={handleInputKeyDown}
                            disabled={disabled}
                        />
                        {isLoading && <i className={cn(styles.loadingIcon, 'icon-spinner')} />}
                    </div>
                </div>

                {/* Dropdown with existing options */}
                {isDropdownOpen && !disabled && (filteredOptions.length > 0 || inputValue.trim()) && (
                    <div className={styles.dropdown}>
                        {filteredOptions.map(option => (
                            <div key={option.value} className={cn(styles.dropdownItem, 'body-14M')} onClick={() => selectOption(option)}>
                                {option.label}
                            </div>
                        ))}
                        {inputValue.trim() && !filteredOptions.some(opt => opt.label === inputValue.trim()) && (
                            <div
                                className={cn(styles.dropdownItem, styles.createNew, 'body-14M')}
                                onClick={() => addItem(inputValue.trim())}>
                                <i className='icon-plus' /> Add "{inputValue.trim()}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Error message */}
            {errorMessage && <span className={cn(styles.errorMessage, 'body-12R')}>{errorMessage}</span>}

            {/* Click outside handler */}
            {isDropdownOpen && <div className={styles.backdrop} onClick={() => setIsDropdownOpen(false)} />}
        </div>
    );
};

export default EditableMultiSelect;
