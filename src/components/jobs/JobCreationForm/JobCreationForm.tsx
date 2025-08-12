import cn from 'classnames';
import dayjs from 'dayjs';
import { Loader } from 'rsuite';

import { useEffect, useState } from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import ArrivalWindow from 'components/ArrivalWindow/ArrivalWindow';
import { radioBtns } from 'components/CustomerForm/utils';
import JobFiles from 'components/jobs/JobFiles';
import { Checkbox, EditableBrandSelect, EditableSelect, Radio, Select, Textarea } from 'components/ui/Input';

import { jobFormCheckBoxes } from './utils';
import { LENGTH_L, LENGTH_S, REQUIRED_FIELD } from 'constants/common';
import { APP_ROUTES } from 'constants/routes';
import useSelectOptions from 'hooks/useSelectOptions';
import useTimezone from 'hooks/useTimezone';
import { parametrizeRouterURL } from 'routes/utils';
import { createJob } from 'services/jobService';
import { IAw, SelectOption } from 'types/common';
import { JobValues } from 'types/jobTypes';

import styles from './JobCreationForm.module.css';

const JobCreationForm = () => {
    const navigate = useNavigate();

    const {
        allTags,
        getAllTags,
        types,
        getTypes,
        businessUnits,
        getBusinessUnits,
        technicians,
        getTechnicians,
        leadSources,
        getLeadSources,
        brands,
        getBrands,
        jobTypes,
        getJobTypes
    } = useSelectOptions();

    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        clearErrors,
        watch
    } = useFormContext<JobValues>();

    const selectedBusinessUnit = watch('businessUnit');
    const selectedJobType = watch('jobType');

    useEffect(() => {
        if (selectedJobType) {
            const matchedType = jobTypes.summaries?.find(opt => opt.value === selectedJobType.value);
            if (matchedType?.summary) setValue('summary', matchedType.summary);
        }
    }, [selectedJobType, jobTypes.summaries, setValue]);

    const handleTimeChange = (aw: Record<string, number> | null) => {
        if (aw) {
            setValue('aw', { scheduledEnd: aw.scheduledEnd, scheduledStart: aw.scheduledStart });
            clearErrors('aw');
        } else setValue('aw', null);
    };

    const onJobSubmit = (data: JobValues) => {
        if (!data.selectedClient?.address?.id) {
            console.error('Something went wrong. Client has no addressId.');
            return;
        }

        const payload = {
            clientId: data.selectedClient?.client.id,
            businessUnitId: data.businessUnit?.value,
            typeName: data.jobType?.label,
            leadSourceId: data.leadSource?.value,
            brands: data.brands.map((brand: SelectOption) => brand.label),
            category: data.category,
            summary: data.summary,
            notes: data.notes.trim(),
            addressId: data.selectedClient?.address.id,
            tags: data.tags.map((tag: SelectOption) => tag.value),
            files: data.files,
            emailNotification: data.emailNotification,
            phoneNotification: data.phoneNotification,
            appointment: {
                appointmentTypeId: data.appointmentType?.value,
                technicianIds: Array.isArray(data.technicians) ? data.technicians.map((tech: SelectOption) => tech.value) : [],
                scheduledStart: (data?.aw as IAw).scheduledStart,
                scheduledEnd: (data?.aw as IAw).scheduledEnd
            }
        };

        setIsLoading(true);
        createJob(payload)
            .then(resp => {
                navigate(parametrizeRouterURL(APP_ROUTES.jobs.item, { jobId: String(resp.id) }));
            })
            .catch(err => toast.error(err))
            .finally(() => setIsLoading(false));
    };

    const onError = (errors: FieldValues) => {
        if (errors.selectedClient) toast.error('Please enter customer information.');
    };

    return (
        <form id='creation-job-form' className={styles.form} onSubmit={handleSubmit(onJobSubmit, onError)}>
            {isLoading && <Loader size='lg' center />}

            <h2 className={cn(styles.title, 'h-16B')}>General Job Details</h2>

            <Controller
                name='businessUnit'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <Select
                        {...field}
                        label='Business unit'
                        placeholder='Select business unit'
                        options={businessUnits.options}
                        onFocus={() => {
                            getBusinessUnits();
                            setValue('technicians', null);
                        }}
                        errorMessage={errors.businessUnit?.message}
                        isLoading={businessUnits.isLoading}
                    />
                )}
            />

            <Controller
                name='jobType'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <EditableSelect
                        label='Job type'
                        placeholder='Select or type job type'
                        options={jobTypes.options}
                        value={field.value}
                        onChange={field.onChange}
                        onFocus={getJobTypes}
                        errorMessage={errors.jobType?.message}
                        isLoading={jobTypes.isLoading}
                    />
                )}
            />

            <Controller
                name='appointmentType'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <Select
                        {...field}
                        label='Appointment type'
                        placeholder='Select appointment type'
                        options={types.options}
                        onFocus={getTypes}
                        errorMessage={errors.appointmentType?.message}
                        isLoading={types.isLoading}
                    />
                )}
            />

            <Controller
                name='leadSource'
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label='Lead source (optional)'
                        placeholder='Select lead source'
                        options={leadSources.options}
                        onFocus={getLeadSources}
                        isLoading={leadSources.isLoading}
                    />
                )}
            />

            <Controller
                name='brands'
                control={control}
                render={({ field }) => (
                    <EditableBrandSelect
                        label='Brand (optional)'
                        placeholder='Add brand...'
                        options={brands.options}
                        value={field.value || []}
                        onChange={field.onChange}
                        onFocus={getBrands}
                        isLoading={brands.isLoading}
                        tooltipText='Select existing brands or add custom ones (e.g., "LG", "Bosch", "LG: D23B4JJHD5"). Click on any brand to edit it.'
                    />
                )}
            />

            <Controller
                name='category'
                control={control}
                render={({ field }) => (
                    <div className={styles.radioGroup}>
                        <div className={cn(styles.radioGroupLabel, 'body-12R')}>Category</div>
                        {radioBtns.map(el => (
                            <Radio
                                key={el.value}
                                id={String(el.value)}
                                value={el.value}
                                label={el.label}
                                checked={field.value === el.value}
                                onChange={() => field.onChange(el.value)}
                            />
                        ))}
                    </div>
                )}
            />

            <Controller
                name='aw'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field, fieldState }) => (
                    <ArrivalWindow
                        start={field.value?.scheduledStart || null}
                        end={field.value?.scheduledEnd || null}
                        handleTimeChange={handleTimeChange}
                        className={styles.fullWidth}
                        errorMessage={fieldState.error?.message}
                    />
                )}
            />

            <Controller
                name='summary'
                control={control}
                rules={{ required: REQUIRED_FIELD }}
                render={({ field }) => (
                    <div className={styles.fullWidth}>
                        <Textarea
                            {...field}
                            label='Summary'
                            placeholder='Enter summary'
                            maxLength={LENGTH_L}
                            errorMessage={errors.summary?.message}
                            autoResize
                        />
                    </div>
                )}
            />

            <Controller
                name='technicians'
                control={control}
                render={({ field }) => {
                    const value = field.value || [];

                    const handleChange = (newValue: unknown) => {
                        const selected = Array.isArray(newValue) ? newValue : [];
                        field.onChange(selected);
                    };

                    return (
                        <Select
                            {...field}
                            value={value}
                            onChange={handleChange}
                            label='Technicians'
                            placeholder='Select technicians'
                            options={technicians.options}
                            onFocus={() => getTechnicians(Number(selectedBusinessUnit?.value))}
                            isLoading={technicians.isLoading}
                            isClearable
                            isMulti
                        />
                    );
                }}
            />

            <Controller
                name='tags'
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label='Tags'
                        placeholder='Select tags'
                        options={allTags.options}
                        onFocus={getAllTags}
                        isLoading={allTags.isLoading}
                        isMulti
                    />
                )}
            />

            <Controller
                name='notes'
                control={control}
                render={({ field }) => <Textarea {...field} label='Notes' placeholder='Enter note' maxLength={LENGTH_S} />}
            />
            <JobFiles
                uploadedFiles={[]}
                addFile={value => setValue('files', [...getValues('files'), value])}
                removeFile={name => setValue('files', [...getValues('files').filter(el => el.name !== name)])}
                className={styles.uploadFiles}
            />

            <div className={styles.notifications}>
                <h2 className={cn(styles.title, 'body-16M')}>Select Job Notifications</h2>
                {jobFormCheckBoxes.map(el => (
                    <Controller
                        key={el.name}
                        name={el.name}
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                            <Checkbox
                                name={name}
                                label={el.label}
                                checked={Boolean(value)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
                            />
                        )}
                    />
                ))}
            </div>
        </form>
    );
};

export default JobCreationForm;
