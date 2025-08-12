import cn from 'classnames';
import { Loader } from 'rsuite';

import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import DeleteModal from 'components/Modals/DeleteModal';
import Modal from 'components/Modals/Modal';
import Table from 'components/Table/Table';
import Button from 'components/ui/Button';
import { Input, Select } from 'components/ui/Input';
import SettingsHeader from 'pages/settings/SettingsHeader';

import { emptyDefaultValues, tableColumns } from './utilsTaxRates';
import { LIMIT } from 'constants/common';
import useIntersectionPagination from 'hooks/useIntersectionPagination';
import useModal from 'hooks/useModal';
import { getTaxStatesOptions, taxRatesServices } from 'services/settings/taxRatesServices';
import { SelectOption } from 'types/common';
import { TaxRate, TaxRatesFormValues } from 'types/settingsTypes';

import styles from './TaxRates.module.css';

const TaxRatesPage = () => {
    const { isOpen, openModal, closeModal } = useModal();
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedTaxRate, setSelectedTaxRate] = useState<TaxRate | null>(null);
    const [statesOptions, setStatesOptions] = useState<SelectOption[]>([]);
    const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    const loadTaxRates = useCallback((pageNumber: number) => {
        setIsLoading(true);
        taxRatesServices
            .fetch(pageNumber, LIMIT)
            .then(res => {
                setTaxRates(prev => (pageNumber === 0 ? res.data : [...prev, ...res.data]));
                setTotal(res.pagination.total);
                setHasMore(res.data.length === LIMIT);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        loadTaxRates(0);
        getTaxStatesOptions()
            .then(statesOptionsData => {
                setStatesOptions(statesOptionsData);
            })
            .catch(err => toast.error(err.message))
            .finally(() => setIsLoading(false));
    }, [loadTaxRates]);

    const { intersectionRef, handleScroll } = useIntersectionPagination({
        loadMore: () => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadTaxRates(nextPage);
        },
        hasMore,
        isLoading
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        getValues
    } = useForm<TaxRatesFormValues>({ mode: 'onChange', defaultValues: emptyDefaultValues });

    const handleConfirmDelete = useCallback(async (): Promise<void> => {
        if (!selectedTaxRate) return Promise.resolve();
        setIsLoading(true);

        return taxRatesServices
            .delete(selectedTaxRate.id)
            .then(() => setTaxRates(prev => prev.filter(rate => rate.id !== selectedTaxRate.id)))
            .then(() => {
                closeModal();
                setSelectedTaxRate(null);
                setTotal(prev => prev - 1);
            })
            .catch(e => {
                toast.error(e.message);
            })
            .finally(() => setIsLoading(false));
    }, [selectedTaxRate, closeModal]);

    const handleSave = useCallback(() => {
        const isEdit = Boolean(selectedTaxRate);
        const formData = getValues();
        const nameValue = typeof formData.name === 'string' ? formData.name : formData.name.value;

        const payload = {
            name: String(nameValue),
            ratePercent: Number(formData.ratePercent)
        };
        setIsLoading(true);
        const request = isEdit
            ? taxRatesServices
                  .update(selectedTaxRate!.id, payload)
                  .then(() => setTaxRates(prev => prev.map(rate => (rate.id === selectedTaxRate!.id ? { ...rate, ...payload } : rate))))
            : taxRatesServices.create(payload).then(created => setTaxRates(prev => [...prev, created]));

        return request
            .then(() => {
                closeModal();
                setSelectedTaxRate(null);
                reset(emptyDefaultValues);
            })
            .catch(e => toast.error(e.message))
            .finally(() => setIsLoading(false));
    }, [selectedTaxRate, closeModal, reset, getValues]);

    const handleOpenModal = (item: TaxRate | null = null, deleteMode = false) => {
        const matchedOption = statesOptions.find(o => o.value === item?.name) ?? null;
        reset(item ? { name: matchedOption ?? '', ratePercent: item.ratePercent } : emptyDefaultValues);
        setSelectedTaxRate(item);
        setIsDeleteMode(deleteMode);
        openModal();
    };

    return (
        <>
            <SettingsHeader title='Tax Rates' btnText='Add New' btnWidth='15.9rem' onAddClick={() => handleOpenModal()} />

            <Table
                className={styles.table}
                columns={tableColumns}
                data={taxRates}
                gridTemplateColumns='28rem 5.6rem 4.3rem'
                getActionsConfig={() => [
                    { label: 'Edit', action: item => handleOpenModal(item) },
                    { label: 'Delete', action: item => handleOpenModal(item, true) }
                ]}
                totalItems={total}
                onRowClick={item => handleOpenModal(item, false)}
                loadingTriggerRef={intersectionRef}
                onScroll={handleScroll}
                hasMore={hasMore}
                showInlineLoader={isLoading}
                showPagination
            />

            {isDeleteMode && selectedTaxRate && (
                <DeleteModal isOpen={isOpen} onClose={closeModal} onConfirm={handleConfirmDelete} itemName={selectedTaxRate.name} />
            )}

            {!isDeleteMode && (
                <Modal isOpen={isOpen} onClose={closeModal} className={styles.modal}>
                    <h2 className={cn(styles.modalTitle, 'h-16B')}>{selectedTaxRate ? 'Edit Tax Rate' : 'Add Tax Rate'}</h2>
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className={styles.fields}>
                            <Controller
                                name='name'
                                control={control}
                                rules={{ required: 'Required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label='Province'
                                        placeholder='Select province'
                                        options={statesOptions}
                                        className={styles.provinceField}
                                    />
                                )}
                            />
                            <Controller
                                name='ratePercent'
                                control={control}
                                rules={{
                                    required: 'Required',
                                    max: { value: 100, message: 'Max is 100%' },
                                    pattern: {
                                        value: /^\d{1,3}(\.\d{0,3})?$/,
                                        message: 'Up to 3 decimals allowed'
                                    }
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type='number'
                                        placeholder='0.000%'
                                        label='Tax rate'
                                        errorMessage={errors.ratePercent?.message}
                                        className={styles.ratePercentField}
                                    />
                                )}
                            />
                        </div>
                        <div className={styles.actions}>
                            <Button btnStyle='text-btn-m' onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button btnStyle='blue-m' isLoading={isLoading} type='submit' disabled={!isValid || !watch('name')}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {isLoading && <Loader center size='lg' />}
        </>
    );
};

export default TaxRatesPage;
