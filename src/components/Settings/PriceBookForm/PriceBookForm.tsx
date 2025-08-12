import MaterialPriceInputs from '../MaterialPriceInputs/MaterialPriceInputs';
import cn from 'classnames';
import parseDuration from 'parse-duration';

import { Controller, useForm } from 'react-hook-form';

import SettingsFormBtns from 'components/Settings/SettingsFormBtns/SettingsFormBtns';
import { Input } from 'components/ui/Input';

import { MaterialPriceFormValues } from 'types/settingsTypes';

import styles from './PriceBookForm.module.css';

interface PriceBookFormProps {
    onSubmit: (data: MaterialPriceFormValues) => void;
    defaultValues: MaterialPriceFormValues;
}

const PriceBookForm: React.FC<PriceBookFormProps> = ({ onSubmit, defaultValues }) => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<MaterialPriceFormValues>({ defaultValues, mode: 'onChange' });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <MaterialPriceInputs nameLabel='Service' control={control} errors={errors} />

            <div className={styles.duration}>
                <Controller
                    name='duration'
                    control={control}
                    rules={{
                        pattern: {
                            value: /^\d+[hm](\s\d+[hm])?$/, // Поддержка "600m", "5h", "5h 30m"
                            message: 'Invalid format'
                        },
                        validate: value => {
                            if (value) {
                                const milliseconds = parseDuration(value);
                                return milliseconds !== null || 'Invalid duration';
                            } else return true;
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            className={styles.durationInput}
                            label='Service Duration (Optional)'
                            placeholder='Enter duration'
                            onChange={e => {
                                // Allow only numbers, h, m and spaces to be entered
                                const value = e.target.value.replace(/[^\dhm\s]/g, '').replace(/(h|m)+/g, '$1');
                                field.onChange(value);
                            }}
                            onBlur={e => {
                                let value = e.target.value.trim();
                                value = value.replace(/(\d+)(?=[^\dhms]|$)/g, '$1m');

                                if (value) {
                                    const milliseconds = parseDuration(value);
                                    if (milliseconds !== null) {
                                        const totalMinutes = Math.floor(milliseconds / 60000);
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        let formatted = `${hours}h`;
                                        if (minutes > 0) {
                                            formatted += ` ${minutes}m`;
                                        }
                                        field.onChange(formatted);
                                    }
                                }
                                field.onBlur();
                            }}
                            errorMessage={errors.duration?.message}
                        />
                    )}
                />
                <p className={cn(styles.durationHint, 'body-12R')}>Use the format: 1h 45m</p>
                <ul className={cn(styles.durationList, 'body-12R')}>
                    <li>h = hours</li>
                    <li>m = minutes</li>
                </ul>
            </div>

            <SettingsFormBtns />
        </form>
    );
};

export default PriceBookForm;
