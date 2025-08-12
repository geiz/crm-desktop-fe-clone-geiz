import cn from 'classnames';

import { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    overlayClassName?: string;
    closeOnClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className, overlayClassName }) => {
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    // Block scroll when modal is open and add padding to the body, header and footer to avoid content shift
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const elements = [document.body, document.querySelector('.header'), document.querySelector('.footer')].filter(
            Boolean
        ) as HTMLElement[];

        const applyPadding = (value: string) => {
            elements.forEach(el => {
                el.style.paddingRight = value;
            });
        };

        if (isOpen) {
            document.documentElement.classList.add('no-scroll');
            if (scrollbarWidth > 0) {
                applyPadding(`${scrollbarWidth}px`);
            }
        } else {
            document.documentElement.classList.remove('no-scroll');
            applyPadding('');
        }

        // Clean up on unmount modal
        return () => {
            document.documentElement.classList.remove('no-scroll');
            applyPadding('');
        };
    }, [isOpen]);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        const target = e.target as Element;
        // Close the modal only if the click is outside the modal content
        // and not on the datepicker popup (.rs-picker-popup).
        setTimeout(() => {
            if (!modalRef.current?.contains(target) && !document.querySelector('.rs-picker-popup')) {
                onClose();
            }
        }, 0);
    };

    return (
        <CSSTransition
            nodeRef={nodeRef}
            classNames={{
                enter: styles['overlay-enter'],
                enterActive: styles['overlay-enter-active'],
                exit: styles['overlay-exit'],
                exitActive: styles['overlay-exit-active']
            }}
            in={isOpen}
            timeout={300}
            unmountOnExit>
            <div ref={nodeRef} className={cn(styles.overlay, overlayClassName)} onMouseDown={handleMouseDown}>
                <div ref={modalRef} className={cn(styles.modal, className)} onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </CSSTransition>
    );
};

export default Modal;
