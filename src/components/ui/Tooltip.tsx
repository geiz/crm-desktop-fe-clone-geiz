import cn from 'classnames';
import { Tooltip as RsTooltip, Whisper, WhisperProps } from 'rsuite';

import 'rsuite/Tooltip/styles/index.css';

import styles from './Tooltip.module.css';

interface TooltipProps extends Pick<WhisperProps, 'placement' | 'trigger'> {
    text: string;
    children: React.ReactNode;
    className?: string;
}

const Tooltip = ({ text, children, placement = 'bottom', trigger = 'hover' }: TooltipProps) => {
    return (
        <Whisper
            placement={placement}
            trigger={trigger}
            speaker={
                <RsTooltip className={cn(styles.tooltip, 'body-12R')} arrow={false}>
                    {text}
                </RsTooltip>
            }>
            {children}
        </Whisper>
    );
};

export default Tooltip;
