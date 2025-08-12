import cn from 'classnames';

import styles from './Checkbox.module.css';

//TODO: remove this file and use ./ui/Input/Checkbox.tsx
interface CheckboxProps {
    label: string;
    color: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, color, checked, onChange, className }) => {
    return (
        <label className={cn(styles.checkbox, className)}>
            <input
                type='checkbox'
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className={styles.checkboxInput}
                style={{
                    accentColor: color
                }}
            />
            <span>{label}</span>
        </label>
    );
};
