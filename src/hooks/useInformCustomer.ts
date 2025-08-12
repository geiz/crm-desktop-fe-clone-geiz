import { useState } from 'react';

interface UseInformModalConfig {
    isOpen: boolean;
    onConfirm: (value: boolean) => void;
    onCancel: () => void;
}

const useInformCustomer = () => {
    const [modalConfig, setModalConfig] = useState<UseInformModalConfig | null>(null);

    const openAsyncModal = () => {
        return new Promise<boolean>((resolve, reject) => {
            setModalConfig({
                isOpen: true,
                onConfirm: (isNotification: boolean) => {
                    setModalConfig(null);
                    resolve(isNotification);
                },
                onCancel: () => {
                    setModalConfig(null);
                    reject(new Error('cancel event moving'));
                }
            });
        });
    };

    return { openAsyncModal, modalConfig };
};

export default useInformCustomer;
