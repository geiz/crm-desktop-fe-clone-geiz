import { useDidMount } from './useDidMount';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import DeleteModal from 'components/Modals/DeleteModal';
import ManageModal from 'components/Modals/ManageModal';

import { LIMIT } from 'constants/common';
import useIntersectionPagination from 'hooks/useIntersectionPagination';
import useModal from 'hooks/useModal';
import { BaseItem } from 'types/common';
import { ApiMethods, Field, SettingsModalType } from 'types/settingsTypes';

interface UseSettingsEntityProps {
    apis: ApiMethods;
    itemName: string;
    fields: Field[];
}

interface UseSettingsEntityReturn {
    data: BaseItem[];
    totalItemsCount: number;
    handleOpenModal: (type: SettingsModalType) => void;
    getActionsConfig: () => Array<{ label: string; action: (item: BaseItem) => void }>;
    renderModal: () => React.JSX.Element | null;
    isLoading: boolean;
    handleEdit: (item: BaseItem) => void;
    handleScroll: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    loadingTriggerRef: (node?: Element | null) => void;
    hasMore: boolean;
}

const useSettingsEntity = ({ apis, itemName, fields }: UseSettingsEntityProps): UseSettingsEntityReturn => {
    const { isOpen, openModal, closeModal } = useModal();
    const [modalType, setModalType] = useState<SettingsModalType | null>(null);
    const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null);
    const [newItem, setNewItem] = useState<Record<string, string>>(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
    const [data, setData] = useState<BaseItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItemsCount, setTotaItemsCount] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const scrollTop = useRef<number>(0);

    const loadItems = useCallback(
        (pageNumber: number) => {
            setIsLoading(true);
            apis.fetch(pageNumber, LIMIT)
                .then(resp => {
                    setData(pageNumber === 0 ? resp.data : [...(data || []), ...resp.data]);
                    setHasMore(resp.data.length === LIMIT);
                    setTotaItemsCount(resp.pagination.total);
                })
                .catch(error => console.error(`Error fetching ${itemName}s:`, error))
                .finally(() => setIsLoading(false));
        },
        [apis, data, itemName]
    );

    useDidMount(() => {
        if (!data || data.length === 0) {
            loadItems(page);
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollTop.current;
        }
    }, []);

    const { intersectionRef, handleScroll } = useIntersectionPagination({
        loadMore: () => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadItems(nextPage);
        },
        hasMore,
        isLoading,
        onScrollChange: top => {
            scrollTop.current = top;
        }
    });

    const handleOpenModal = (type: SettingsModalType, item: BaseItem | null = null) => {
        setModalType(type);
        setSelectedItem(item);
        setNewItem(item ? { ...item } : fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
        openModal();
    };

    const handleSave = useCallback(async () => {
        if (modalType === 'add' && Object.values(newItem).every(val => val)) {
            return apis
                .create(newItem)
                .then(createdItem => {
                    setData(prev => [...prev, createdItem]);
                    closeModal();
                    setModalType(null);
                    setNewItem(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
                    setSelectedItem(null);
                })
                .catch(error => {
                    toast.error(error.message);
                    console.error(`Error creating ${itemName}:`, error);
                });
        }

        if (modalType === 'edit' && selectedItem && Object.values(newItem).every(val => val)) {
            return apis
                .update(selectedItem.id, newItem)
                .then(() => {
                    setData(prev => prev.map(item => (item.id === selectedItem.id ? { ...item, ...newItem } : item)));
                    closeModal();
                    setModalType(null);
                    setNewItem(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
                    setSelectedItem(null);
                })
                .catch(error => {
                    toast.error(error.message);
                    console.error(`Error updating ${itemName}:`, error);
                });
        }
        return Promise.resolve();
    }, [modalType, newItem, selectedItem, closeModal, fields, apis, itemName]);

    const handleDelete = useCallback(
        (item: BaseItem) => {
            setSelectedItem(item);
            setModalType('confirm-delete');
            openModal();
        },
        [openModal]
    );

    const handleConfirmDelete = useCallback(() => {
        if (modalType === 'confirm-delete' && selectedItem) {
            return apis
                .delete(selectedItem.id)
                .then(() => {
                    setData(prev => prev.filter(item => item.id !== selectedItem.id));
                    setTotaItemsCount(totalItemsCount - 1);
                    closeModal();
                    setModalType(null);
                    setSelectedItem(null);
                })
                .catch(error => {
                    toast.error(error.message);
                    console.error(`Error deleting ${itemName}:`, error);
                });
        }
        return Promise.resolve();
    }, [modalType, selectedItem, closeModal, apis, itemName, totalItemsCount]);

    const handleEdit = (item: BaseItem) => handleOpenModal('edit', item);

    const getActionsConfig = () => [
        { label: 'Edit', action: handleEdit },
        { label: 'Delete', action: handleDelete }
    ];

    const renderModal = (): React.JSX.Element | null => {
        const isEditMode = modalType === 'edit';

        const manageModal =
            modalType === 'add' || modalType === 'edit' ? (
                <ManageModal
                    isOpen={isOpen}
                    onClose={closeModal}
                    onSave={handleSave}
                    fields={fields}
                    values={newItem}
                    onChange={setNewItem}
                    isEdit={isEditMode}
                    itemName={itemName}
                />
            ) : null;

        const modalComponents: Record<string, React.JSX.Element> = {
            'confirm-delete': (
                <DeleteModal
                    isOpen={isOpen}
                    onClose={closeModal}
                    onConfirm={handleConfirmDelete}
                    itemName={selectedItem ? String(selectedItem[fields[0].key as keyof BaseItem]) : ''}
                />
            ),
            ...(manageModal && {
                add: manageModal,
                edit: manageModal
            })
        };

        return modalComponents[modalType as string] || null;
    };

    return {
        data,
        totalItemsCount,
        handleOpenModal,
        getActionsConfig,
        renderModal,
        isLoading,
        handleEdit,
        handleScroll,
        scrollRef,
        loadingTriggerRef: intersectionRef,
        hasMore
    };
};

export default useSettingsEntity;
