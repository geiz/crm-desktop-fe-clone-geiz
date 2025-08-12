import Tooltip from './Tooltip';
import cn from 'classnames';
import { Popover as RsPopover, Whisper, WhisperProps } from 'rsuite';

import { useState } from 'react';

import 'rsuite/Popover/styles/index.css';

import styles from './Popover.module.css';

interface PopoverProps extends Pick<WhisperProps, 'trigger' | 'placement'> {
    children: React.ReactNode;
    popoverContent: React.ReactNode;
    tooltipText?: string;
    childrenStyle?: string;
    onClose?: () => void;
    className?: string;
}

const Popover: React.FC<PopoverProps> = ({
    children,
    onClose,
    className,
    popoverContent,
    tooltipText,
    childrenStyle,
    placement = 'autoVertical'
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleOpen = () => {
        setIsPopoverOpen(true);
    };

    const handleClose = () => {
        if (onClose) onClose();
        setIsPopoverOpen(false);
    };

    const popover = (
        <RsPopover className={cn(styles.popoverContainer, className)} arrow={false}>
            <div className='body-14M'>{popoverContent}</div>
        </RsPopover>
    );

    return (
        <Whisper trigger='click' placement='autoVertical' speaker={popover} onOpen={handleOpen} onClose={handleClose}>
            <div className={cn(childrenStyle, 'pointer')}>
                {tooltipText && !isPopoverOpen ? (
                    <Tooltip trigger='hover' placement={placement} text={tooltipText}>
                        {children}
                    </Tooltip>
                ) : (
                    children
                )}
            </div>
        </Whisper>
    );
};

export default Popover;
