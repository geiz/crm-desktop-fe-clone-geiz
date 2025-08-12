import cn from 'classnames';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import EmployeeForm from 'components/Settings/EmployeeForm/EmployeeForm';

import { UNKNOWN_ERROR } from 'constants/common';
import { USERS_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { useDidMount } from 'hooks/useDidMount';
import { apiRequest } from 'services/apiUtils';
import { addEmployee, clearEmployeesStore, storeEmployees } from 'store/slices/employeesSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { Method } from 'types/common';
import { Employee, EmployeeFormValues } from 'types/settingsTypes';
import { emptyDefaultValues, transformEmployeePayload } from 'utils/settings/employeeUtils';

import styles from './EmployeesPage.module.css';

const AddEmployeePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { employees } = useAppSelector(state => state.employees);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // TODO: check logic page reloading when adding / updating
    // if user reload this page - redux will be empty
    // and table consists only one added / updated item
    useDidMount(() => {
        if (!employees) {
            setIsLoading(true);
            apiRequest<Employee[]>({ url: USERS_ENDPOINTS.employees, method: Method.GET, params: { limit: 500 } })
                .then(resp => {
                    dispatch(storeEmployees(resp));
                })
                .catch(() => {
                    toast.error(UNKNOWN_ERROR);
                    navigate(APP_ROUTES.settings.employees);
                })
                .finally(() => setIsLoading(false));
        }
    });

    const onSubmit = (data: EmployeeFormValues) => {
        const payload = transformEmployeePayload(data);

        setIsLoading(true);
        apiRequest<Employee>({ url: USERS_ENDPOINTS.invite, method: Method.POST, data: payload })
            .then(resp => {
                dispatch(addEmployee(resp));
                dispatch(clearEmployeesStore()); // Clear employees store to force refresh
                toast.success(`${resp.name} successfully added!`);
                navigate(APP_ROUTES.settings.employees);
            })
            .catch(err => {
                console.error('Error adding employee:', err);
                toast.error(err.message || 'Failed to add employee');
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.formTitle, 'h-16B')}>Add New User</h3>
            <EmployeeForm defaultValues={emptyDefaultValues} onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    );
};

export default AddEmployeePage;
