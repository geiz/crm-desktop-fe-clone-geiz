import { Loader } from 'rsuite';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import DeleteModal from 'components/Modals/DeleteModal';
import Table from 'components/Table/Table';
import SettingsHeader from 'pages/settings/SettingsHeader';

import { LIMIT } from 'constants/common';
import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { useDidMount } from 'hooks/useDidMount';
import useIntersectionPagination from 'hooks/useIntersectionPagination';
import useModal from 'hooks/useModal';
import { parametrizeRouterURL } from 'routes/utils';
import { apiRequest } from 'services/apiUtils';
import { deleteJobType, getAllJobTypes } from 'services/settings/jobTypeService';
import { parametrizeURL } from 'services/utils';
import { setJobTypesScrollTop, setJobTypesTotal, storeJobTypes } from 'store/slices/jobTypesSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { Method } from 'types/common';
import { JobType } from 'types/settingsTypes';
import { tableColumns } from 'utils/settings/jobTypes';

import styles from './JobTypes.module.css';

const JobTypesPage = () => {
    const deleteModal = useModal();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [selectedJobType, setSelectedJobType] = useState<JobType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { jobTypes, page: savedPage, scrollTop, total } = useAppSelector(state => state.jobTypes);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollTop;
        }
    }, [scrollTop]);

    const loadJobTypes = useCallback(
        (pageNumber: number) => {
            setIsLoading(true);
            getAllJobTypes(pageNumber, LIMIT)
                .then(resp => {
                    console.log(resp.data);

                    dispatch(storeJobTypes(pageNumber === 0 ? resp.data : [...(jobTypes || []), ...resp.data]));
                    setHasMore(resp.data.length === LIMIT);
                    dispatch(setJobTypesTotal(resp.pagination.total));
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        },
        [dispatch, jobTypes]
    );

    useDidMount(() => {
        if (!jobTypes || jobTypes.length === 0) {
            loadJobTypes(savedPage);
        }
    });

    const { intersectionRef, handleScroll } = useIntersectionPagination({
        loadMore: () => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadJobTypes(nextPage);
        },
        hasMore,
        isLoading,
        onScrollChange: top => dispatch(setJobTypesScrollTop(top))
    });

    const handleDelete = async () => {
        deleteJobType(String(selectedJobType?.id))
            .then(() => {
                if (jobTypes) {
                    const updated = jobTypes.filter(el => el.id !== selectedJobType?.id);
                    dispatch(storeJobTypes(updated));
                    dispatch(setJobTypesTotal(total - 1));
                    setSelectedJobType(null);
                    deleteModal.closeModal();
                }
            })
            .catch(err => toast.error(err.message));
    };

    const handleEdit = (item: JobType) => navigate(parametrizeRouterURL(APP_ROUTES.settings.editJobTypes, { jobTypeId: String(item.id) }));

    const getActionsConfig = () => [
        {
            label: 'Edit',
            action: handleEdit
        },
        {
            label: 'Delete',
            action: (item: JobType) => {
                setSelectedJobType(item);
                deleteModal.openModal();
            }
        }
    ];

    return (
        <>
            <SettingsHeader
                title='Job Type'
                btnText='Add Job Type'
                btnWidth='15.9rem'
                onAddClick={() => navigate(APP_ROUTES.settings.addJobTypes)}
            />

            {jobTypes && (
                <Table
                    className={styles.table}
                    columns={tableColumns}
                    data={jobTypes}
                    gridTemplateColumns='28rem 48.4rem 2.4rem'
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

            {selectedJobType && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.closeModal}
                    onConfirm={handleDelete}
                    itemName={selectedJobType.name}
                />
            )}

            {isLoading && <Loader center size='lg' />}
        </>
    );
};

export default JobTypesPage;
