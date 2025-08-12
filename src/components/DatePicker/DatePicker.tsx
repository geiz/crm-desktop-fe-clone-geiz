import cn from 'classnames';
import { DatePicker as RsuiteDatePicker } from 'rsuite';

import { DATEPICKER_FORMAT } from 'constants/common';

import './DatePicker.css';
import 'rsuite/DatePicker/styles/index.css';

const DatePicker = ({ value, onChange, label, placeholder = 'Select date', disabled = false, errorMessage = '', ...props }) => {
    const CalendarIcon = () => <i className='icon-small-calendar' />;

    return (
        <div className={cn('datepicker-wrap', { 'datepicker-wrap-error': errorMessage })}>
            {label && <label className={cn('datepicker-label', 'body-12R')}>{label}</label>}
            <RsuiteDatePicker
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                caretAs={CalendarIcon}
                className='custom-datepicker'
                format={DATEPICKER_FORMAT}
                oneTap // without 'ok' button // locale
                cleanable={false}
                {...props}
            />
            {errorMessage && <span className={cn('datepicker-error', 'body-12R')}>{errorMessage}</span>}
        </div>
    );
};

export default DatePicker;
