import cn from 'classnames';

import Button from 'components/ui/Button';
import { Select, Toggle } from 'components/ui/Input';

import { CustomField } from 'types/settingsTypes';

import styles from './CustomFieldItem.module.css';

interface CustomFieldItemProps {
    field: CustomField;
    onToggleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEdit: () => void;
    onDelete: () => void;
    isDisabled?: boolean;
}

const CustomFieldItem = ({ field, onToggleChange, onEdit, onDelete, isDisabled }: CustomFieldItemProps) => {
    return (
        <div className={styles.wrap}>
            <span className={cn(styles.label, 'body-14M')}>{field.name}</span>
            {field.type === 'toggle' ? (
                <Toggle disabled={isDisabled} checked={field.value === true} onChange={onToggleChange} />
            ) : (
                <Select
                    className={styles.select}
                    options={field.options ?? []}
                    value={((field.value as string[] | undefined) ?? []).map(val => ({ label: val, value: val }))}
                    isMulti
                    isClearable={false}
                    isDisabled
                />
            )}
            <div className={styles.actions}>
                <Button className={styles.action} disabled={isDisabled} type='button' btnStyle='icon-btn' icon='edit' onClick={onEdit} />
                <Button className={styles.action} disabled={isDisabled} type='button' btnStyle='icon-btn' icon='trash' onClick={onDelete} />
            </div>
        </div>
    );
};

export default CustomFieldItem;
