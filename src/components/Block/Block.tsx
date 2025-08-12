import cn from 'classnames';

import styles from './Block.module.css';

interface BlockProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
}

const Block = ({ children, className, ...props }: BlockProps) => {
    return (
        <div className={cn(styles.block, className)} {...props}>
            {children}
        </div>
    );
};

export default Block;
