import cn from 'classnames';
import { Loader } from 'rsuite';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import FormActions from 'components/Appointment/FormActions';
import DeleteModal from 'components/Modals/DeleteModal';
import IconModal from 'components/Modals/IconModal';
import EmployeeForm from 'components/Settings/EmployeeForm/EmployeeForm';
import Button from 'components/ui/Button';

import { UNKNOWN_ERROR } from 'constants/common';
import { USERS_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { useDidMount } from 'hooks/useDidMount';
import useEmployees from 'hooks/useEmployees';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { clearEmployeesStore, setSelectedEmployee, updateEmployee } from 'store/slices/employeesSlice';
import { useAppDispatch } from 'store/store';
import { Method, Role } from 'types/common';
import { CustomFieldsData } from 'types/settingsTypes';
import { Employee, EmployeeFormValues, EmployeeStatus } from 'types/settingsTypes';
import phoneToMaskString from 'utils/phoneToMaskString';
import { emptyTechnician, roleOptions, transformEmployeePayload } from 'utils/settings/employeeUtils';

import styles from './EmployeesPage.module.css';

const EditEmployeePage = () => {
    const { emplId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { selected, confirmDelete, getActionsConfig, isSameUser, deleteModal, deactivateModal, confirmDeactivate } = useEmployees();
    const [initFormValues, setInitFormValues] = useState<EmployeeFormValues | null>(null);
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({ page: true, submit: false });

    useDidMount(() => {
        if (emplId) {
            apiRequest<Employee>({ method: Method.GET, url: parametrizeURL(USERS_ENDPOINTS.byId, { emplId }) })
                .then(resp => {
                    dispatch(setSelectedEmployee(resp));
                    const isTechnician = resp.role === Role.TECHNICIAN;
                    const role = roleOptions.find(option => option.value === resp.role);
                    const formValues = {
                        id: resp.id,
                        name: resp.name,
                        email: resp.email,
                        status: resp.status,
                        role: role || '',
                        phone: phoneToMaskString(resp.phone || ''),
                        slackHandle: resp.slackHandle || '',
                        technician: emptyTechnician
                    };

                    if (isTechnician) {
                        const technician = {
                            hourlyRate: resp.technician?.hourlyRate || '',
                            loadRate: resp.technician?.loadRate || '',
                            businessUnit: ''
                        };

                        // Set up technician data with all fields, with safe fallbacks
                        const technicianData = {
                            ...technician,
                            areas: resp.technician?.areas || emptyTechnician.areas,
                            schedule: Array.isArray(resp.technician?.schedule) ? resp.technician.schedule : emptyTechnician.schedule,
                            scheduleSpecifics: resp.technician?.scheduleSpecifics || '',
                            brands: resp.technician?.brands
                                ? {
                                      supported: Array.isArray(resp.technician.brands.supported)
                                          ? resp.technician.brands.supported.map(brand => ({ value: brand.id, label: brand.name }))
                                          : [],
                                      unsupported: Array.isArray(resp.technician.brands.unsupported)
                                          ? resp.technician.brands.unsupported.map(brand => ({ value: brand.id, label: brand.name }))
                                          : []
                                  }
                                : emptyTechnician.brands,
                            appliances: resp.technician?.appliances
                                ? {
                                      individuals: Array.isArray(resp.technician.appliances.individuals)
                                          ? resp.technician.appliances.individuals.map(app => ({ value: app.id, label: app.name }))
                                          : [],
                                      businesses: Array.isArray(resp.technician.appliances.businesses)
                                          ? resp.technician.appliances.businesses.map(app => ({ value: app.id, label: app.name }))
                                          : []
                                  }
                                : emptyTechnician.appliances,
                            customSettings: resp.technician?.customSettings as CustomFieldsData
                        };

                        if (isTechnician && resp.technician?.businessUnit) {
                            // Business unit data is already available in the response
                            const formValuesWithBUnit = {
                                ...formValues,
                                technician: {
                                    ...technicianData,
                                    businessUnit: {
                                        value: resp.technician.businessUnit.id,
                                        label: resp.technician.businessUnit.name
                                    }
                                }
                            };
                            setInitFormValues(formValuesWithBUnit);
                        } else {
                            setInitFormValues({ ...formValues, technician: technicianData }); // no bunit specified
                        }
                    } else {
                        setInitFormValues(formValues); // user is not technician
                    }
                })
                .catch(err => {
                    console.error(err);
                    toast.error(UNKNOWN_ERROR);
                })
                .finally(() => setIsLoading(prev => ({ ...prev, page: false })));
        }
    });

    const onSubmit = (data: EmployeeFormValues) => {
        const payload = transformEmployeePayload(data);

        setIsLoading(prev => ({ ...prev, submit: true }));
        apiRequest<Employee>({
            url: parametrizeURL(USERS_ENDPOINTS.byId, { emplId: String(emplId) }),
            method: Method.PUT,
            data: payload
        })
            .then(resp => {
                dispatch(updateEmployee(resp));
                dispatch(clearEmployeesStore()); // Clear employees store to force refresh
                toast.success(`${resp.name} successfully updated!`);
                navigate(APP_ROUTES.settings.employees);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(prev => ({ ...prev, submit: false })));
    };

    if (isLoading.page) return <Loader center size='lg' />;

    return (
        <div className={styles.container}>
            <div className={styles.editPageHeader}>
                <h3 className={cn(styles.formTitle, 'h-16B')}>User Information</h3>
                {selected && !isSameUser() && (
                    <div className={styles.actionButtons}>
                        {getActionsConfig(selected, true)
                            .filter(action => Boolean(action.icon))
                            .map(b => (
                                <Button
                                    key={b.label}
                                    icon={b.icon}
                                    isRedIcon={b.isRedIcon}
                                    btnStyle='grey-l'
                                    onClick={() => b.action(selected)}>
                                    {b.label}
                                </Button>
                            ))}
                    </div>
                )}
            </div>
            {initFormValues && (
                <EmployeeForm
                    defaultValues={initFormValues}
                    onSubmit={onSubmit}
                    disabled={selected?.status === EmployeeStatus.DEACTIVATED}
                    isRoleDisabled={selected?.role === Role.TECHNICIAN && selected?.status === EmployeeStatus.ACTIVE}
                    isLoading={isLoading.submit}
                    isEditing
                />
            )}
            {selected && (
                <>
                    <DeleteModal
                        isOpen={deleteModal.isOpen}
                        onClose={deleteModal.closeModal}
                        onConfirm={confirmDelete}
                        itemName={selected?.name || ''}
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
        </div>
    );
};

export default EditEmployeePage;
