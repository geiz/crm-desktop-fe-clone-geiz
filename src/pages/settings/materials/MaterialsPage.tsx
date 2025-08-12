import { Loader } from 'rsuite';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import DeleteModal from 'components/Modals/DeleteModal';
import { tableColumns } from 'components/Settings/utilsMaterials';
import Table from 'components/Table/Table';
import SettingsHeader from 'pages/settings/SettingsHeader';

import { LIMIT } from 'constants/common';
import { APP_ROUTES } from 'constants/routes';
import { useDidMount } from 'hooks/useDidMount';
import useIntersectionPagination from 'hooks/useIntersectionPagination';
import useModal from 'hooks/useModal';
import { parametrizeRouterURL } from 'routes/utils';
import { deleteMaterial, getAllMaterials } from 'services/settings/materialsService';
import { setMaterialsScrollTop, setMaterialsTotal, storeMaterials } from 'store/slices/materialsSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { Material } from 'types/settingsTypes';

import styles from './Materials.module.css';

const MaterialsPage = () => {
    const deleteModal = useModal();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { materials, page: savedPage, scrollTop, total } = useAppSelector(state => state.materials);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollTop;
        }
    }, [scrollTop]);

    const loadMaterials = useCallback(
        (pageNumber: number) => {
            setIsLoading(true);
            getAllMaterials(pageNumber, LIMIT)
                .then(resp => {
                    console.log(resp.data);

                    dispatch(storeMaterials(pageNumber === 0 ? resp.data : [...(materials || []), ...resp.data]));
                    setHasMore(resp.data.length === LIMIT);
                    dispatch(setMaterialsTotal(resp.pagination.total));
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        },
        [dispatch, materials]
    );

    useDidMount(() => {
        if (!materials || materials.length === 0) {
            loadMaterials(savedPage);
        }
    });

    const { intersectionRef, handleScroll } = useIntersectionPagination({
        loadMore: () => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadMaterials(nextPage);
        },
        hasMore,
        isLoading,
        onScrollChange: top => dispatch(setMaterialsScrollTop(top))
    });

    const handleDelete = async () => {
        deleteMaterial(String(selectedMaterial?.id))
            .then(() => {
                if (materials) {
                    const updated = materials.filter(el => el.id !== selectedMaterial?.id);
                    dispatch(storeMaterials(updated));
                    dispatch(setMaterialsTotal(total - 1));
                    setSelectedMaterial(null);
                    deleteModal.closeModal();
                }
            })
            .catch(err => toast.error(err.message));
    };

    const handleEdit = (item: Material) =>
        navigate(parametrizeRouterURL(APP_ROUTES.settings.editMaterials, { materialId: String(item.id) }));

    const getActionsConfig = () => [
        {
            label: 'Edit',
            action: handleEdit
        },
        {
            label: 'Delete',
            action: (item: Material) => {
                setSelectedMaterial(item);
                deleteModal.openModal();
            }
        }
    ];

    return (
        <>
            <SettingsHeader
                title='Materials'
                btnText='Add New'
                btnWidth='15rem'
                onAddClick={() => navigate(APP_ROUTES.settings.addMaterials)}
            />

            {materials && (
                <Table
                    className={styles.table}
                    columns={tableColumns}
                    data={materials}
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

            {selectedMaterial && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.closeModal}
                    onConfirm={handleDelete}
                    itemName={selectedMaterial.name}
                />
            )}
            {isLoading && <Loader center size='lg' />}
        </>
    );
};

export default MaterialsPage;
