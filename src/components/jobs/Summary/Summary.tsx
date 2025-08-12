import cn from 'classnames';

import Block from 'components/Block/Block';
import TextboxModal from 'components/Modals/TextboxModal';
import Button from 'components/ui/Button';

import { LENGTH_L } from 'constants/common';
import useModal from 'hooks/useModal';

import styles from './Summary.module.css';

interface SummaryProps {
    onSave: (newValue: string) => Promise<void>;
    text: string;
}

const Summary: React.FC<SummaryProps> = ({ text = '', onSave }) => {
    const { isOpen, openModal, closeModal } = useModal();

    const handleSave = (newValue: string) => {
        return onSave(newValue).then(() => {
            closeModal();
        });
    };

    return (
        <Block className={styles.block}>
            <div className={styles.header}>
                <h3 className={cn(styles.title, 'h-16B')}>Summary</h3>
                <Button
                    btnStyle='icon-btn'
                    aria-label='edit'
                    className={cn(styles.editButton, 'icomoon', 'icon-edit')}
                    onClick={openModal}
                />
            </div>

            <pre role='text' className={cn(styles.text, 'body-16R')}>
                {text}
            </pre>

            <TextboxModal
                title='Summary'
                isOpen={isOpen}
                onClose={closeModal}
                value={text}
                onSave={handleSave}
                placeholder='Enter details'
                maxLength={LENGTH_L}
            />
        </Block>
    );
};

export default Summary;
