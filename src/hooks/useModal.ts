import { useCallback, useState } from 'react';

interface UseModalReturn {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    toggleModal: () => void;
}

const useModal = (): UseModalReturn => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleModal = useCallback(() => {
        setIsOpen(prevState => !prevState);
    }, []);

    return { isOpen, openModal, closeModal, toggleModal };
};

export default useModal;
