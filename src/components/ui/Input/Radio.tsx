import cn from 'classnames';

import styles from './Radio.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string | React.ReactNode;
}

const Radio = ({ id, label, ...props }: Props) => {
    return (
        <div className={styles.radioWrap}>
            <input id={id} className={styles.radio} type='radio' {...props} />
            {label && (
                <label htmlFor={id} className={cn(styles.radioLabel, styles.radioWrap, 'body-14R', 'label-t')}>
                    {label}
                </label>
            )}
        </div>
    );
};

export default Radio;
