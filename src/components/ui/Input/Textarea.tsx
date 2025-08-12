import cn from 'classnames';

import { forwardRef, useEffect, useRef } from 'react';

import CharCounter from 'components/CharCounter/CharCounter';
import ErrorMessage from 'components/ui/ErrorMessage';

import useUniqueId from 'hooks/useUniqueId';

import styles from './Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    maxLength?: number;
    disabled?: boolean;
    helperText?: string;
    errorMessage?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    textbox?: boolean;
    height?: number;
    autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            maxLength,
            disabled = false,
            helperText,
            errorMessage,
            value,
            onChange,
            textbox = false,
            height,
            autoResize = false,
            className,
            ...props
        },
        ref
    ) => {
        const uniqueId = useUniqueId(props.id, props.name, 'textarea');
        const currentLength = value?.length || 0;

        const localRef = useRef<HTMLTextAreaElement | null>(null);
        const combinedRef = (node: HTMLTextAreaElement) => {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref && 'current' in ref) {
                (ref as React.RefObject<HTMLTextAreaElement>).current = node;
            }
            localRef.current = node;
        };

        useEffect(() => {
            if (autoResize && localRef.current) {
                const el = localRef.current;
                const prevHeight = el.style.height;
                el.style.height = 'auto';

                const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                const newHeightRem = el.scrollHeight / rootFontSize + 'rem'; // convert el.height to rem depends of current(responsive) rootFontSize

                el.style.height = prevHeight;

                requestAnimationFrame(() => {
                    el.style.height = newHeightRem;
                });
            }
        }, [value, autoResize]);

        const textareaElement = (
            <textarea
                id={uniqueId}
                className={cn(
                    styles.textarea,
                    'body-16R',
                    {
                        [styles.textbox]: textbox
                    },
                    className
                )}
                {...(maxLength !== undefined && { maxLength })}
                disabled={disabled}
                ref={combinedRef}
                value={value}
                onChange={onChange}
                style={{
                    height: !autoResize && height ? `${height}rem` : undefined,
                    overflow: autoResize ? 'auto' : undefined
                    // resize: autoResize ? 'none' : undefined  // TODO: check icon
                }}
                {...props}
            />
        );

        return (
            <div
                className={cn(styles.textareaWrapper, className, {
                    [styles.disabledWrap]: disabled,
                    [styles.textboxWrapper]: textbox
                })}>
                {label && (
                    <label htmlFor={uniqueId} className={cn(styles.label, 'body-12R')}>
                        {label}
                    </label>
                )}
                {textbox ? (
                    <div className={cn(styles.scrollWrapper, { [styles.error]: errorMessage })}>{textareaElement}</div>
                ) : (
                    textareaElement
                )}
                {errorMessage ? (
                    <ErrorMessage message={errorMessage} className={styles.errorMessage} />
                ) : helperText ? (
                    <span className={cn(styles.helperText, 'body-12R')}>{helperText}</span>
                ) : null}
                {maxLength && <CharCounter current={currentLength} max={maxLength} className={styles.charCounter} />}
            </div>
        );
    }
);

export default Textarea;
