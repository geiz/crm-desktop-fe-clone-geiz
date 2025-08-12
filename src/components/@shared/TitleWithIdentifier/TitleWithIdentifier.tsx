import cn from 'classnames';

import formatIdTo8Digits from 'utils/formatIdTo8digits';

import styles from './TitleWithIdentifier.module.css';

interface Props {
    name: string;
    identifier?: number | string;
}

/**
 * Renders a title with an identifier.
 * @param {string} name - The title string.
 * @param {number} id - The identifier number.
 * @returns {JSX.Element} The title with identifier.
 */
export const TitleWithIdentifier = ({ name, identifier }: Props) => {
    return (
        <h1 className={cn('h-20B', styles.title)}>
            {name}:<span className={styles.identifier}>{identifier ? formatIdTo8Digits(identifier) : ''}</span>
        </h1>
    );
};
