import { useMask } from '@react-input/mask';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import AreaSearch from 'components/AreaSearch/AreaSearch';
import DeleteModal from 'components/Modals/DeleteModal';
import Modal from 'components/Modals/Modal';
import CustomFieldItem from 'components/Settings/EmployeeForm/CustomFields/CustomFieldItem';
import CustomFieldsModalInner from 'components/Settings/EmployeeForm/CustomFields/CustomFieldsModalInner';
import SettingsFormBtns from 'components/Settings/SettingsFormBtns/SettingsFormBtns';
import { WorkSchedule } from 'components/WorkSchedule';
import Button from 'components/ui/Button';
import { Input, Select, Textarea } from 'components/ui/Input';

import { INVALID_INPUT, LENGTH_S, PHONE_MASK, REQUIRED_FIELD } from 'constants/common';
import { useCustomFields } from 'hooks/useCustomFields';
import useModal from 'hooks/useModal';
import useSelectOptions from 'hooks/useSelectOptions';
import { useTechnicianProfile } from 'hooks/useTechnicianProfile';
import { Role, SelectOption } from 'types/common';
import { Area, CustomField, EmployeeFormValues, EmployeeStatus, ToggleField } from 'types/settingsTypes';
import controllNumericInput from 'utils/controllNumericInput';
import { roleOptions } from 'utils/settings/employeeUtils';
import { emailValidation, optionalPhoneRules } from 'utils/validationRules';

import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
    defaultValues: EmployeeFormValues;
    onSubmit: (data: EmployeeFormValues) => void;
    disabled?: boolean;
    isRoleDisabled?: boolean;
    isLoading?: boolean;
    isEditing?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
    defaultValues,
    onSubmit,
    disabled,
    isRoleDisabled = false,
    isLoading = false,
    isEditing = false
}) => {
    const { businessUnits, getBusinessUnits } = useSelectOptions();
    const { brands, appliances, isLoadingBrands, isLoadingAppliances, getBrands, getAppliances } = useTechnicianProfile();
    const [hasWorkScheduleErrors, setHasWorkScheduleErrors] = useState(false);
    const [editKey, setEditKey] = useState<string | null>(null);
    const customFieldsModal = useModal();
    const deleteCustomFieldModal = useModal();
    const phoneRef = useMask(PHONE_MASK);
    const { fields, initFieldsFromSettings, saveAndSubmitField, deleteField } = useCustomFields();
    const [fieldKeyToDelete, setFieldKeyToDelete] = useState<string | null>(null);
    const [isCustomFieldSaving, setIsCustomFieldSaving] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<EmployeeFormValues>({
        defaultValues,
        mode: 'onChange'
    });

    useEffect(() => {
        if (defaultValues?.technician?.customSettings) {
            initFieldsFromSettings(defaultValues.technician.customSettings);
        }
    }, [defaultValues, initFieldsFromSettings]);

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    useEffect(() => {
        if ((watch('role') as SelectOption)?.value === Role.TECHNICIAN) {
            getBrands();
            getAppliances();
        }
    }, [watch, getBrands, getAppliances]);

    const roleValue = watch('role');
    const watchedAreas = watch('technician.areas');
    const watchedBrands = watch('technician.brands');

    const handlePrimaryAreaSelect = (area: Area | null) => {
        setValue('technician.areas.primary', area);
    };

    const handleNearbyAreaSelect = (area: Area | null) => {
        if (area) {
            const currentNearby = getValues('technician.areas.nearby') || [];
            setValue('technician.areas.nearby', [...currentNearby, area]);
        }
    };

    const handleExcludedAreaSelect = (area: Area | null) => {
        if (area) {
            const currentExcluded = getValues('technician.areas.excluded') || [];
            setValue('technician.areas.excluded', [...currentExcluded, area]);
        }
    };

    const handleRemoveNearbyAreaByIndex = (index: number) => {
        const currentNearby = getValues('technician.areas.nearby') || [];
        setValue(
            'technician.areas.nearby',
            currentNearby.filter((_, i) => i !== index)
        );
    };

    const handleRemoveExcludedAreaByIndex = (index: number) => {
        const currentExcluded = getValues('technician.areas.excluded') || [];
        setValue(
            'technician.areas.excluded',
            currentExcluded.filter((_, i) => i !== index)
        );
    };

    // Filter brands to prevent selection of same brand in both supported and unsupported
    const getFilteredBrands = (exclude: SelectOption[] = []) => {
        const excludeIds = exclude.map(brand => brand.value);
        return brands.filter(brand => !excludeIds.includes(brand.value));
    };

    const handleSupportedBrandsChange = (selectedBrands: SelectOption[] | null) => {
        const supportedBrands = selectedBrands || [];

        // Remove any newly selected brands from unsupported
        const currentUnsupported = getValues('technician.brands.unsupported') || [];
        const supportedIds = supportedBrands.map(brand => brand.value);
        const filteredUnsupported = currentUnsupported.filter(brand => !supportedIds.includes(brand.value));

        setValue('technician.brands.supported', supportedBrands);
        setValue('technician.brands.unsupported', filteredUnsupported);
    };

    const handleUnsupportedBrandsChange = (selectedBrands: SelectOption[] | null) => {
        const unsupportedBrands = selectedBrands || [];

        // Remove any newly selected brands from supported
        const currentSupported = getValues('technician.brands.supported') || [];
        const unsupportedIds = unsupportedBrands.map(brand => brand.value);
        const filteredSupported = currentSupported.filter(brand => !unsupportedIds.includes(brand.value));

        setValue('technician.brands.unsupported', unsupportedBrands);
        setValue('technician.brands.supported', filteredSupported);
    };

    const handleCustomToggleChange = (key: string, field: CustomField) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (field.type !== 'toggle') return;

        const updatedField: ToggleField = {
            ...field,
            value: e.target.checked
        };

        saveAndSubmitField(defaultValues.id, key, updatedField)
            .then(() => toast.success('Custom field saved'))
            .catch(() => toast.error('Failed to save custom field'));
    };

    const handleCustomFieldEditClick = (key: string) => {
        setEditKey(key);
        customFieldsModal.openModal();
    };

    const handleCustomFieldDeleteClick = (key: string) => {
        setFieldKeyToDelete(key);
        deleteCustomFieldModal.openModal();
    };

    const handleSubmitCustomFields = (field: CustomField) => {
        const prevKey = editKey ?? field.name;
        setIsCustomFieldSaving(true);

        saveAndSubmitField(defaultValues.id, prevKey, field)
            .then(() => toast.success('Custom fields saved'))
            .catch(() => toast.error('Failed to save custom fields'))
            .finally(() => {
                setIsCustomFieldSaving(false);
                customFieldsModal.closeModal();
                setEditKey(null);
            });
    };

    const handleCustomFieldDeleteConfirm = async (): Promise<void> => {
        if (!fieldKeyToDelete) return;

        await deleteField(defaultValues.id, fieldKeyToDelete);
        toast.success('Field deleted');
        deleteCustomFieldModal.closeModal();
        setFieldKeyToDelete(null);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputsWrap}>
                <Controller
                    name='name'
                    control={control}
                    rules={{
                        required: REQUIRED_FIELD,
                        validate: value => {
                            if (!value.trim()) return INVALID_INPUT;
                            return true;
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label='Full Name*'
                            placeholder='Enter Full Name'
                            errorMessage={errors.name?.message}
                            readOnly={disabled}
                        />
                    )}
                />
                <Controller
                    name='role'
                    control={control}
                    rules={{ required: REQUIRED_FIELD }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label='Role*'
                            options={roleOptions}
                            placeholder='Select Role'
                            errorMessage={errors.role?.message}
                            isDisabled={isRoleDisabled || disabled}
                            hideDropdownIndicator={isRoleDisabled}
                        />
                    )}
                />
                <Controller
                    name='email'
                    control={control}
                    rules={emailValidation}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            {...field}
                            label='Email*'
                            placeholder='Enter E-mail'
                            type='email'
                            errorMessage={error?.message}
                            readOnly={disabled}
                        />
                    )}
                />
                <Controller
                    name='phone'
                    control={control}
                    rules={optionalPhoneRules}
                    render={({ field }) => (
                        <Input
                            {...field}
                            ref={phoneRef}
                            label='Phone Number'
                            placeholder='Enter Phone Number'
                            errorMessage={errors.phone?.message}
                            readOnly={disabled}
                        />
                    )}
                />

                {(roleValue as SelectOption).value === Role.TECHNICIAN && (
                    <>
                        <Controller
                            name='technician.hourlyRate'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    label='Hourly Rate'
                                    placeholder='Enter the Rate'
                                    value={value ? `$ ${value}` : ''}
                                    onChange={e => onChange(controllNumericInput(e.target.value))}
                                    readOnly={disabled}
                                />
                            )}
                        />
                        <Controller
                            name='technician.loadRate'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Input
                                    label='Load Rate'
                                    placeholder='Enter Associated Expenses'
                                    value={value ? `$ ${value}` : ''}
                                    onChange={e => onChange(controllNumericInput(e.target.value))}
                                    readOnly={disabled}
                                />
                            )}
                        />
                        <Controller
                            name='technician.businessUnit'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label='Business Unit'
                                    placeholder='Select Business Unit'
                                    options={businessUnits.options}
                                    onFocus={getBusinessUnits}
                                    isLoading={businessUnits.isLoading}
                                    isDisabled={disabled}
                                />
                            )}
                        />

                        {isEditing && defaultValues.status !== EmployeeStatus.INVITED && (
                            <>
                                <Controller
                                    name='slackHandle'
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label='Slack Handle'
                                            placeholder='@username'
                                            readOnly={disabled}
                                            className={styles.slackField}
                                        />
                                    )}
                                />

                                {/* Coverage Areas */}
                                <div className={styles.section}>
                                    <h4 className={styles.sectionTitle}>Coverage Area</h4>

                                    {/* Primary Area - Half Width */}
                                    <div className={styles.primaryAreaContainer}>
                                        <div className={styles.areaGroup}>
                                            <AreaSearch
                                                label=''
                                                placeholder='Primary city'
                                                onSelect={handlePrimaryAreaSelect}
                                                selectedAreas={watchedAreas?.primary ? [watchedAreas.primary] : []}
                                                disabled={disabled}
                                                value={watchedAreas?.primary || null}
                                            />
                                        </div>
                                    </div>

                                    {/* Nearby and Excluded Areas - Side by Side */}
                                    <div className={styles.areasRow}>
                                        <div className={styles.areaGroup}>
                                            {(watchedAreas?.nearby || []).map((area, index) => (
                                                <AreaSearch
                                                    key={`nearby-${area.id}-${index}`}
                                                    label=''
                                                    placeholder='Nearby areas'
                                                    onSelect={newArea => {
                                                        if (newArea === null) {
                                                            handleRemoveNearbyAreaByIndex(index);
                                                        } else {
                                                            // Replace this area with the new one
                                                            const currentNearby = getValues('technician.areas.nearby') || [];
                                                            const updatedNearby = currentNearby.map((existing, i) =>
                                                                i === index ? newArea : existing
                                                            );
                                                            setValue('technician.areas.nearby', updatedNearby);
                                                        }
                                                    }}
                                                    selectedAreas={watchedAreas?.nearby || []}
                                                    disabled={disabled}
                                                    value={area}
                                                />
                                            ))}
                                            {/* Only show empty field if no nearby areas exist */}
                                            {(!watchedAreas?.nearby || watchedAreas.nearby.length === 0) && (
                                                <AreaSearch
                                                    label=''
                                                    placeholder='Nearby areas'
                                                    onSelect={handleNearbyAreaSelect}
                                                    selectedAreas={watchedAreas?.nearby || []}
                                                    disabled={disabled}
                                                />
                                            )}
                                        </div>

                                        <div className={styles.areaGroup}>
                                            {(watchedAreas?.excluded || []).map((area, index) => (
                                                <AreaSearch
                                                    key={`excluded-${area.id}-${index}`}
                                                    label=''
                                                    placeholder='Excluded areas'
                                                    onSelect={newArea => {
                                                        if (newArea === null) {
                                                            handleRemoveExcludedAreaByIndex(index);
                                                        } else {
                                                            // Replace this area with the new one
                                                            const currentExcluded = getValues('technician.areas.excluded') || [];
                                                            const updatedExcluded = currentExcluded.map((existing, i) =>
                                                                i === index ? newArea : existing
                                                            );
                                                            setValue('technician.areas.excluded', updatedExcluded);
                                                        }
                                                    }}
                                                    selectedAreas={watchedAreas?.excluded || []}
                                                    disabled={disabled}
                                                    value={area}
                                                />
                                            ))}
                                            {/* Only show empty field if no excluded areas exist */}
                                            {(!watchedAreas?.excluded || watchedAreas.excluded.length === 0) && (
                                                <AreaSearch
                                                    label=''
                                                    placeholder='Excluded areas'
                                                    onSelect={handleExcludedAreaSelect}
                                                    selectedAreas={watchedAreas?.excluded || []}
                                                    disabled={disabled}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Work Schedule */}
                                <div className={styles.section}>
                                    <h4 className={styles.sectionTitle}>Work Schedule</h4>

                                    <Controller
                                        name='technician.schedule'
                                        control={control}
                                        render={({ field }) => (
                                            <WorkSchedule
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                onValidationChange={setHasWorkScheduleErrors}
                                                disabled={disabled}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Schedule Specifics */}
                                <div className={styles.section}>
                                    <h4 className={styles.sectionTitle}>Schedule Specifics (Optional)</h4>

                                    <Controller
                                        name='technician.scheduleSpecifics'
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                placeholder='Add any schedule comments or specifics...'
                                                rows={3}
                                                readOnly={disabled}
                                                maxLength={LENGTH_S}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Brand Coverage */}
                                <div className={styles.section}>
                                    <h4 className={styles.sectionTitle}>Brands Coverage</h4>

                                    <div className={styles.brandSection}>
                                        <Controller
                                            name='technician.brands.supported'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label='Supported brands'
                                                    options={getFilteredBrands(watchedBrands?.unsupported || [])}
                                                    placeholder='Select supported brands'
                                                    isMulti
                                                    onFocus={() => getBrands()}
                                                    onChange={newValue => handleSupportedBrandsChange(newValue as SelectOption[] | null)}
                                                    isLoading={isLoadingBrands}
                                                    isDisabled={disabled}
                                                    getOptionValue={(option: unknown) => `${(option as SelectOption)?.value}`}
                                                    getOptionLabel={(option: unknown) => (option as SelectOption)?.label || ''}
                                                />
                                            )}
                                        />

                                        <Controller
                                            name='technician.brands.unsupported'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label='Unsupported brands'
                                                    options={getFilteredBrands(watchedBrands?.supported || [])}
                                                    placeholder='Select unsupported brands'
                                                    isMulti
                                                    onFocus={() => getBrands()}
                                                    onChange={newValue => handleUnsupportedBrandsChange(newValue as SelectOption[] | null)}
                                                    isLoading={isLoadingBrands}
                                                    isDisabled={disabled}
                                                    getOptionValue={(option: unknown) => `${(option as SelectOption)?.value}`}
                                                    getOptionLabel={(option: unknown) => (option as SelectOption)?.label || ''}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Appliance Types */}
                                <div className={styles.section}>
                                    <h4 className={styles.sectionTitle}>Type of Appliance Coverage</h4>

                                    <div className={styles.applianceSection}>
                                        <Controller
                                            name='technician.appliances.individuals'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label='Individual'
                                                    options={appliances}
                                                    placeholder='Select individual appliances'
                                                    isMulti
                                                    onFocus={getAppliances}
                                                    isLoading={isLoadingAppliances}
                                                    isDisabled={disabled}
                                                    getOptionValue={(option: unknown) => `${(option as SelectOption)?.value}`}
                                                    getOptionLabel={(option: unknown) => (option as SelectOption)?.label || ''}
                                                />
                                            )}
                                        />

                                        <Controller
                                            name='technician.appliances.businesses'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label='Business'
                                                    options={appliances}
                                                    placeholder='Select business appliances'
                                                    isMulti
                                                    onFocus={getAppliances}
                                                    isLoading={isLoadingAppliances}
                                                    isDisabled={disabled}
                                                    getOptionValue={(option: unknown) => `${(option as SelectOption)?.value}`}
                                                    getOptionLabel={(option: unknown) => (option as SelectOption)?.label || ''}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Custom Fields */}
                                <div className={styles.section}>
                                    <h4 className={styles.sectionTitle}>Profile Custom Fields</h4>
                                    {fields.map(({ key, field }) => (
                                        <CustomFieldItem
                                            key={key}
                                            field={field}
                                            onToggleChange={handleCustomToggleChange(key, field)}
                                            onEdit={() => handleCustomFieldEditClick(key)}
                                            onDelete={() => handleCustomFieldDeleteClick(key)}
                                            isDisabled={disabled}
                                        />
                                    ))}

                                    <Button
                                        className={styles.addCustomFieldBtn}
                                        type='button'
                                        btnStyle='outlined-s'
                                        icon='plus'
                                        disabled={disabled}
                                        onClick={() => {
                                            setEditKey(null);
                                            customFieldsModal.openModal();
                                        }}>
                                        Add Custom Field
                                    </Button>

                                    <Modal
                                        isOpen={customFieldsModal.isOpen}
                                        className={styles.recoverAppointmentModal}
                                        onClose={customFieldsModal.closeModal}>
                                        <CustomFieldsModalInner
                                            closeModal={customFieldsModal.closeModal}
                                            isEdit={Boolean(editKey)}
                                            initialValues={editKey ? fields.find(f => f.key === editKey)?.field : undefined}
                                            onSubmit={handleSubmitCustomFields}
                                            isLoading={isCustomFieldSaving}
                                        />
                                    </Modal>
                                    <DeleteModal
                                        isOpen={deleteCustomFieldModal.isOpen}
                                        onClose={() => {
                                            deleteCustomFieldModal.closeModal();
                                            setFieldKeyToDelete(null);
                                        }}
                                        onConfirm={handleCustomFieldDeleteConfirm}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <SettingsFormBtns disabled={disabled} isLoading={isLoading} hasValidationErrors={hasWorkScheduleErrors} />
        </form>
    );
};

export default EmployeeForm;
