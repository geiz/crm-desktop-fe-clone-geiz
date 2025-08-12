import cn from 'classnames';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Button from 'components/ui/Button';

import styles from './Dropdown.module.css';

interface DropdownProps {
    trigger?: React.ReactNode;
    options: { label: string | ReactNode; onClick: () => void }[];
    className?: string;
    disabled?: boolean;
}

const Dropdown: FC<DropdownProps> = ({ trigger, options, className, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // DOM-element refs
    const dropdownRef = useRef<HTMLDivElement>(null); // dropdown
    const triggerRef = useRef<HTMLDivElement>(null); // trigger
    const nodeRef = useRef<HTMLDivElement>(null); // for smooth animation of appearance

    const GAP = 10;

    // state switching (open/close)
    const toggle = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (disabled) return;
        setIsOpen(prev => !prev);
    };

    const close = () => setIsOpen(false);

    const updatePosition = () => {
        const trigger = triggerRef.current;
        const dropdown = dropdownRef.current;
        if (!trigger || !dropdown) return;

        const triggerRect = trigger.getBoundingClientRect();
        const dropdownHeight = dropdown.offsetHeight;
        const dropdownWidth = dropdown.offsetWidth;

        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        const shouldOpenUpward = dropdownHeight + GAP > spaceBelow && spaceAbove > dropdownHeight + GAP;

        const top = shouldOpenUpward
            ? Math.max(GAP, triggerRect.top - dropdownHeight)
            : Math.min(window.innerHeight - dropdownHeight - GAP, triggerRect.bottom);

        const left = Math.min(Math.max(GAP, triggerRect.right - dropdownWidth), window.innerWidth - dropdownWidth - GAP);

        setPosition({ top, left });
    };

    useEffect(() => {
        if (!isOpen) return;
        const raf = requestAnimationFrame(updatePosition); // wait for browser to render
        const clean = () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return clean;
    }, [isOpen]);

    // closing on click outside dropdown and on scrolling
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
                close();
            }
        };
        const scrollClose = () => close();

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', scrollClose, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', scrollClose, true);
        };
    }, [isOpen]);

    return (
        <>
            {/* Trigger element, click to open/close menu */}
            <div ref={triggerRef} className={cn(styles.trigger, className)} onClick={toggle}>
                {trigger || <Button disabled={disabled} btnStyle='icon-btn' className={cn(styles.btn, 'icomoon', 'icon-more')} />}
            </div>

            {/* Render dropdown through the portal (in body), with animation */}
            {createPortal(
                <CSSTransition
                    nodeRef={nodeRef}
                    in={isOpen}
                    timeout={200}
                    classNames={{
                        enter: styles['menu-enter'],
                        enterActive: styles['menu-enter-active'],
                        exit: styles['menu-exit'],
                        exitActive: styles['menu-exit-active']
                    }}
                    unmountOnExit>
                    <div
                        ref={node => {
                            nodeRef.current = node;
                            dropdownRef.current = node;
                        }}
                        className={styles.menu}
                        style={{ ...position, position: 'fixed', zIndex: 4000 }}>
                        {options.map(({ label, onClick }, i) => (
                            <button
                                key={i}
                                className={cn(styles.option, 'body-14M')}
                                onClick={e => {
                                    e.stopPropagation();
                                    onClick(); // assuming this is safe and sync
                                    close(); // hide dropdown
                                }}>
                                {label}
                            </button>
                        ))}
                    </div>
                </CSSTransition>,
                document.body
            )}
        </>
    );
};

export default Dropdown;
