import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { USERS_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import useModal from 'hooks/useModal';
import { parametrizeRouterURL } from 'routes/utils';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { clearEmployeesStore, deleteEmployee, setSelectedEmployee, updateEmployee } from 'store/slices/employeesSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { Method } from 'types/common';
import { Employee, EmployeeAction, EmployeeStatus, EmployeeStatusActions } from 'types/settingsTypes';
import { getSuccessMessage } from 'utils/settings/employeeUtils';

const useEmployees = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const deleteModal = useModal();
    const deactivateModal = useModal();
    const { user } = useAppSelector(state => state.auth);
    const selected = useAppSelector(state => state.employees.selectedEmployee);

    const changeStatus = async ({ user, action, successMessage }: { user: Employee; action: EmployeeAction; successMessage: string }) => {
        const isTechnicianDeactivate = user.role === 'TECHNICIAN' && action === EmployeeAction.deactivate;
        const baseUrl = parametrizeURL(USERS_ENDPOINTS.changeStatus, {
            emplId: user.id,
            action
        });

        const url = isTechnicianDeactivate ? `${baseUrl}?force=true` : baseUrl;

        return apiRequest<Employee>({ method: Method.PUT, url })
            .then(resp => {
                dispatch(updateEmployee(resp));
                dispatch(setSelectedEmployee(resp));
                toast.success(successMessage);
            })
            .catch(err => toast.error(err.message));
    };

    const handleAdd = () => navigate(APP_ROUTES.settings.addEmployee);
    const handleEdit = (item: Employee) => navigate(parametrizeRouterURL(APP_ROUTES.settings.editEmployee, { emplId: String(item.id) }));

    const handleDeactivate = (user: Employee) => {
        if (user) dispatch(setSelectedEmployee(user));
        deactivateModal.openModal();
    };

    const confirmDeactivate = async () => {
        if (!selected) return Promise.reject();

        return changeStatus({
            user: selected,
            action: EmployeeAction.deactivate,
            successMessage: getSuccessMessage(selected)[EmployeeAction.deactivate]
        }).then(() => {
            deactivateModal.closeModal();
        });
    };

    const handleDelete = (item: Employee) => {
        if (item) dispatch(setSelectedEmployee(item));
        deleteModal.openModal();
    };

    const confirmDelete = async () => {
        if (!selected) return Promise.reject();

        return apiRequest({
            method: Method.DELETE,
            url: parametrizeURL(USERS_ENDPOINTS.byId, { emplId: String(selected.id) })
        })
            .then(() => {
                dispatch(deleteEmployee(selected));
                dispatch(clearEmployeesStore()); // Clear employees store to force refresh
                toast.success(getSuccessMessage(selected)[EmployeeAction.delete]);
                deleteModal.closeModal();
                dispatch(setSelectedEmployee(null));
                navigate(APP_ROUTES.settings.employees);
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    const isSameUser = (employee?: Employee) => {
        if (employee) return employee?.id === user?.id;
        return selected?.id === user?.id;
    };

    const getActions = (employee: Employee, isEditPage = false): EmployeeStatusActions => ({
        [EmployeeStatus.INVITED]: [
            { label: 'View', action: handleEdit },
            {
                label: 'Resend Invite',
                action: (user: Employee) =>
                    changeStatus({
                        user,
                        action: EmployeeAction.reinvite,
                        successMessage: getSuccessMessage(user)[EmployeeAction.reinvite]
                    }),
                icon: 'refresh'
            },
            {
                label: 'Delete',
                action: handleDelete,
                icon: 'trash',
                isRedIcon: true
            }
        ],
        [EmployeeStatus.ACTIVE]: [
            { label: 'View', action: handleEdit },
            ...(!isSameUser(employee)
                ? [
                      {
                          label: isEditPage ? 'Deactivate User' : 'Deactivate',
                          action: handleDeactivate,
                          icon: 'cancel',
                          isRedIcon: true
                      }
                  ]
                : [])
        ],
        [EmployeeStatus.DEACTIVATED]: [
            { label: 'View', action: handleEdit },
            {
                label: 'Reactivate',
                action: (user: Employee) =>
                    changeStatus({
                        user,
                        action: EmployeeAction.activate,
                        successMessage: getSuccessMessage(user)[EmployeeAction.activate]
                    }),
                icon: 'refresh'
            }
        ]
    });

    const getActionsConfig = (employee: Employee, isEditPage = false) => getActions(employee, isEditPage)[employee.status];

    return {
        selected,
        deleteModal,
        confirmDelete,
        deactivateModal,
        confirmDeactivate,
        getActionsConfig,
        handleAdd,
        handleEdit,
        isSameUser
    };
};

export default useEmployees;
