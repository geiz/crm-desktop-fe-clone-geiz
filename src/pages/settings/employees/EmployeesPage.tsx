import { Loader } from 'rsuite';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import FormActions from 'components/Appointment/FormActions';
import DeleteModal from 'components/Modals/DeleteModal';
import IconModal from 'components/Modals/IconModal';
import Table from 'components/Table/Table';
import SettingsHeader from 'pages/settings/SettingsHeader';

import { LIMIT } from 'constants/common';
import { USERS_ENDPOINTS } from 'constants/endpoints';
import { useDidMount } from 'hooks/useDidMount';
import useEmployees from 'hooks/useEmployees';
import useIntersectionPagination from 'hooks/useIntersectionPagination';
import { apiRequest } from 'services/apiUtils';
import { setEmployeesPage, setEmployeesScrollTop, setEmployeesTotal, storeEmployees } from 'store/slices/employeesSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { Method } from 'types/common';
import { Employee } from 'types/settingsTypes';
import { tableColumns } from 'utils/settings/employeeUtils';

import styles from './EmployeesPage.module.css';

const EmployeesPage = () => {
    const dispatch = useAppDispatch();
    const { getActionsConfig, selected, confirmDelete, deleteModal, handleAdd, handleEdit, deactivateModal, confirmDeactivate } =
        useEmployees();
    const employees = useAppSelector(state => state.employees.employees) as Employee[];
    const savedPage = useAppSelector(state => state.employees.page);
    const scrollTop = useAppSelector(state => state.employees.scrollTop);
    const total = useAppSelector(state => state.employees.total);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollTop;
        }
    }, [scrollTop]);

    const loadEmployees = useCallback(
        (pageNumber: number) => {
            setIsLoading(true);
            apiRequest<Employee[]>({
                url: USERS_ENDPOINTS.employees,
                method: Method.GET,
                params: { page: pageNumber, limit: LIMIT },
                withPagination: true
            })
                .then(resp => {
                    dispatch(storeEmployees(pageNumber === 0 ? resp.data : [...(employees || []), ...resp.data]));
                    setHasMore(resp.data.length === LIMIT);
                    dispatch(setEmployeesTotal(resp.pagination.total));
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        },
        [dispatch, employees]
    );

    useDidMount(() => {
        if (!employees || employees.length === 0) {
            loadEmployees(savedPage);
        }
    });

    const { intersectionRef, handleScroll } = useIntersectionPagination({
        loadMore: () => {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(setEmployeesPage(nextPage));
            loadEmployees(nextPage);
        },
        hasMore,
        isLoading,
        onScrollChange: top => dispatch(setEmployeesScrollTop(top))
    });

    return (
        <>
            <SettingsHeader title='All Employees' btnWidth='15rem' onAddClick={handleAdd} />
            {employees && (
                <Table
                    className={styles.table}
                    columns={tableColumns}
                    data={employees}
                    gridTemplateColumns='14.4rem 20rem 7rem 7rem 14rem 8.8rem 4.3rem'
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
            {selected && (
                <>
                    <DeleteModal
                        isOpen={deleteModal.isOpen}
                        onClose={deleteModal.closeModal}
                        onConfirm={confirmDelete}
                        itemName={selected.name}
                    />
                    <IconModal
                        isOpen={deactivateModal.isOpen}
                        onClose={deactivateModal.closeModal}
                        icon={{ font: 'icon-trash', red: true }}
                        title={`Are you sure you want to Deactivate ${selected?.name}?`}>
                        <FormActions onClose={deactivateModal.closeModal} onConfirm={confirmDeactivate} />
                    </IconModal>
                </>
            )}
            {isLoading && <Loader center size='lg' />}
        </>
    );
};

export default EmployeesPage;
