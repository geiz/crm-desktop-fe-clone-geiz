import { Loader } from 'rsuite';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import DeleteModal from 'components/Modals/DeleteModal';
import { tableColumns } from 'components/Settings/utilsPriceBook';
import Table from 'components/Table/Table';
import SettingsHeader from 'pages/settings/SettingsHeader';

import { LIMIT } from 'constants/common';
import { APP_ROUTES } from 'constants/routes';
import { useDidMount } from 'hooks/useDidMount';
import useIntersectionPagination from 'hooks/useIntersectionPagination';
import useModal from 'hooks/useModal';
import { parametrizeRouterURL } from 'routes/utils';
import { deleteService, getAllServices } from 'services/settings/priceBookService';
import { setPriceBookScrollTop, setPriceBookTotal } from 'store/slices/priceBookSlice';
import { getAllServicesReducer } from 'store/slices/priceBookSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { PriceBook } from 'types/settingsTypes';

import styles from './PriceBook.module.css';

const PriceBookPage = () => {
    const deleteModal = useModal();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedService, setSelectedService] = useState<PriceBook | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { services, page: savedPage, scrollTop, total } = useAppSelector(state => state.priceBook);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollTop;
        }
    }, [scrollTop]);

    const loadServices = useCallback(
        (pageNumber: number) => {
            setIsLoading(true);
            getAllServices(pageNumber, LIMIT)
                .then(resp => {
                    dispatch(getAllServicesReducer(pageNumber === 0 ? resp.data : [...(services || []), ...resp.data]));
                    setHasMore(resp.data.length === LIMIT);
                    dispatch(setPriceBookTotal(resp.pagination.total));
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        },
        [dispatch, services]
    );

    useDidMount(() => {
        if (!services || services.length === 0) {
            loadServices(savedPage);
        }
    });

    const { intersectionRef, handleScroll } = useIntersectionPagination({
        loadMore: () => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadServices(nextPage);
        },
        hasMore,
        isLoading,
        onScrollChange: top => dispatch(setPriceBookScrollTop(top))
    });

    const handleDelete = async () => {
        deleteService(String(selectedService?.id))
            .then(() => {
                if (services) {
                    const updated = services.filter(el => el.id !== selectedService?.id);
                    dispatch(getAllServicesReducer(updated));
                    dispatch(setPriceBookTotal(total - 1));
                    setSelectedService(null);
                    deleteModal.closeModal();
                }
            })
            .catch(err => toast.error(err.message));
    };

    const handleEdit = (item: PriceBook) =>
        navigate(parametrizeRouterURL(APP_ROUTES.settings.editPriceBook, { serviceId: String(item.id) }));

    const getActionsConfig = () => [
        {
            label: 'Edit',
            action: handleEdit
        },
        {
            label: 'Delete',
            action: (item: PriceBook) => {
                setSelectedService(item);
                deleteModal.openModal();
            }
        }
    ];

    return (
        <>
            <SettingsHeader
                title='Price Book'
                btnText='Add New Service'
                btnWidth='19rem'
                onAddClick={() => navigate(APP_ROUTES.settings.addPriceBook)}
            />

            {services && (
                <Table
                    className={styles.table}
                    columns={tableColumns}
                    data={services}
                    gridTemplateColumns='28rem 48.4rem 7.5rem 4.3rem'
                    getActionsConfig={getActionsConfig}
                    onRowClick={handleEdit}
                    onScroll={handleScroll}
                    totalItems={total}
                    scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
                    loadingTriggerRef={intersectionRef}
                    hasMore={hasMore}
                    showInlineLoader={isLoading}
                    showPagination
                />
            )}

            {selectedService && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.closeModal}
                    onConfirm={handleDelete}
                    itemName={selectedService.name}
                />
            )}
            {isLoading && <Loader center size='lg' />}
        </>
    );
};

export default PriceBookPage;
