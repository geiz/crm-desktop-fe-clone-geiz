import cn from 'classnames';

import { useCallback, useEffect, useState } from 'react';

import Button from 'components/ui/Button';
import { CreatableSelect, Input, Radio } from 'components/ui/Input';
import Tooltip from 'components/ui/Tooltip';

import { SelectOption } from 'types/common';
import { CustomField } from 'types/settingsTypes';

import styles from './CustomFieldsModalInner.module.css';

interface CustomFieldsModalInnerProps {
    closeModal: () => void;
    onSubmit: (values: CustomField) => void;
    isEdit?: boolean;
    initialValues?: CustomField;
    isLoading?: boolean;
}

const CustomFieldsModalInner: React.FC<CustomFieldsModalInnerProps> = ({
    closeModal,
    onSubmit,
    isEdit = false,
    initialValues,
    isLoading
}) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'toggle' | 'multiselect'>('multiselect');
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
    const [toggleValue, setToggleValue] = useState(false);
    const [step, setStep] = useState<1 | 2>(isEdit ? 2 : 1);
    const isMultiselect = type === 'multiselect';
    const isToggle = type === 'toggle';
    const isSubmitDisabled = !name.trim() || (isMultiselect && selectedOptions.length === 0);

    const initializeForm = useCallback((initial: CustomField) => {
        setName(initial.name);
        setType(initial.type);
        if (initial.type === 'multiselect') {
            setSelectedOptions(initial.options ?? []);
        } else {
            setSelectedOptions([]);
            setToggleValue(initial.value);
        }
    }, []);

    useEffect(() => {
        if (isEdit && initialValues) {
            initializeForm(initialValues);
        }
    }, [isEdit, initialValues, initializeForm]);

    const handleSave = () => {
        if (isMultiselect) {
            onSubmit({
                name,
                type: 'multiselect',
                options: selectedOptions,
                value: selectedOptions.map(opt => String(opt.value))
            });
        } else {
            onSubmit({
                name,
                type: 'toggle',
                value: toggleValue
            });
        }
    };

    const handleBack = () => {
        setStep(1);
        setName('');
        setSelectedOptions([]);
    };

    const renderTitle = () => {
        if (isEdit) return isMultiselect ? 'Edit Multiselect Field' : 'Edit Toggle Field';
        return isMultiselect ? 'Configure Multiselect Field' : 'Configure Toggle Field';
    };

    return (
        <div className={styles.wrap}>
            {step === 1 && (
                <>
                    <h4 className={cn(styles.title, 'h-16B')}>Create Custom Field</h4>
                    <p className={cn(styles.subtitle, 'body-12R')}>Select the type of custom field you want to add</p>
                    <div className={styles.radioGroup}>
                        <Radio
                            id='multiselect'
                            name='customFieldType'
                            label={
                                <>
                                    Multiselect
                                    <Tooltip text='Select multiple values'>
                                        <i className={cn(styles.alertIcon, 'icomoon icon-info')} />
                                    </Tooltip>
                                </>
                            }
                            checked={type === 'multiselect'}
                            onChange={() => setType('multiselect')}
                        />
                        <Radio
                            id='toggle'
                            name='customFieldType'
                            label={
                                <>
                                    Toggle (True/False)
                                    <Tooltip text='Select only one option'>
                                        <i className={cn(styles.alertIcon, 'icomoon icon-info')} />
                                    </Tooltip>
                                </>
                            }
                            checked={isToggle}
                            onChange={() => setType('toggle')}
                        />
                    </div>
                    <div className={styles.footer}>
                        <Button btnStyle='text-btn-m' type='button' onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button btnStyle='blue-m' onClick={() => setStep(2)}>
                            Next
                        </Button>
                    </div>
                </>
            )}

            {step === 2 && (
                <div className={cn({ [styles.multiselectStep]: isMultiselect, [styles.toggleStep]: isToggle })}>
                    <h4 className={cn(styles.title, 'h-16B')}>{renderTitle()}</h4>

                    <Input
                        className={styles.fieldName}
                        label='Field Name'
                        placeholder='Enter field name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    {isMultiselect && (
                        <CreatableSelect
                            label='Select options'
                            placeholder='Choose options'
                            options={selectedOptions}
                            value={selectedOptions}
                            onChange={val => setSelectedOptions(val as SelectOption[])}
                            isMulti
                            maxMenuHeight={200}
                        />
                    )}

                    <div className={cn(styles.footer)}>
                        {isEdit && (
                            <Button btnStyle='text-btn-m' type='button' onClick={closeModal}>
                                Cancel
                            </Button>
                        )}
                        {!isEdit && (
                            <Button btnStyle='text-btn-m' type='button' onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        <Button btnStyle='blue-m' type='button' onClick={handleSave} disabled={isSubmitDisabled} isLoading={isLoading}>
                            Save
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomFieldsModalInner;
