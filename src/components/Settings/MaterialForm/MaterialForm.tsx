import MaterialPriceInputs from '../MaterialPriceInputs/MaterialPriceInputs';

import { useForm } from 'react-hook-form';

import SettingsFormBtns from 'components/Settings/SettingsFormBtns/SettingsFormBtns';

import { MaterialPriceFormValues } from 'types/settingsTypes';

import styles from './MaterialForm.module.css';

interface MaterialFormProps {
    onSubmit: (data: MaterialPriceFormValues) => void;
    defaultValues: MaterialPriceFormValues;
}

const MaterialForm = ({ onSubmit, defaultValues }: MaterialFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<MaterialPriceFormValues>({ defaultValues, mode: 'onChange' });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <MaterialPriceInputs nameLabel='Material' control={control} errors={errors} />
            <SettingsFormBtns />
        </form>
    );
};

export default MaterialForm;
