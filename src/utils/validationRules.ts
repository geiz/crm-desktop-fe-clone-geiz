import { RegisterOptions } from 'react-hook-form';

import {
    EMAIL_PATTERN,
    INVALID_EMAIL_FORMAT,
    PHONE_LENGTH_ERROR,
    PHONE_MASK,
    REQUIRED_EMAIL_OR_PHONE,
    REQUIRED_FIELD
} from 'constants/common';

type phoneWithEmailValidation = Pick<RegisterOptions, 'validate'>;
type emailWithPhoneValidation = Pick<RegisterOptions, 'validate' | 'pattern'>;
type phoneValidation = Pick<RegisterOptions, 'validate'>;
type emailValidation = Pick<RegisterOptions, 'required' | 'pattern'>;
type priceValidation = Pick<RegisterOptions, 'required' | 'pattern' | 'validate'>;

export const phoneWithEmailValidation = (emailValue: string): phoneWithEmailValidation => ({
    validate: {
        required: (value: string | undefined) => {
            const isEmptyPhone = !value || !/\d/.test(value);
            return isEmptyPhone && !emailValue ? REQUIRED_EMAIL_OR_PHONE : true;
        },
        length: (value: string | undefined) => {
            const digitsOnly = value?.replace(/\D/g, '') || '';
            const isEmptyPhone = !digitsOnly;
            if (isEmptyPhone) return true;
            return digitsOnly.length === 10 || 'Phone number must be 10 digits'; // TODO: use constant
        }
    }
});

export const emailWithPhoneValidation = (phoneValue: string): emailWithPhoneValidation => ({
    validate: {
        required: (value: string | undefined) => {
            const phoneDigits = phoneValue?.replace(/\D/g, '') || '';
            const isEmptyPhone = !phoneDigits;
            return !value && isEmptyPhone ? REQUIRED_EMAIL_OR_PHONE : true;
        }
    },
    pattern: {
        value: EMAIL_PATTERN,
        message: INVALID_EMAIL_FORMAT
    }
});

// TODO: keep in mind we can use phoneValidation emailValidation rules
// only if it is required field. might be better controll require rule in form directly
// check EmployeeForm.tsx phone validation
export const phoneValidation: phoneValidation = {
    validate: {
        required: (value: string | undefined) => {
            const isEmptyPhone = !value || !/\d/.test(value);
            return isEmptyPhone ? REQUIRED_FIELD : true;
        },
        length: (value: string | undefined) => {
            const isEmptyPhone = !value || !/\d/.test(value);
            if (isEmptyPhone) return true;
            const digitsOnly = value.replace(/\D/g, '') || '';
            return digitsOnly.length === 10 || PHONE_LENGTH_ERROR;
        }
    }
};

export const optionalPhoneRules: Pick<RegisterOptions, 'validate'> = {
    validate: (value: string) => {
        if (!value) return true;
        if (value.length !== PHONE_MASK.mask.length) return PHONE_LENGTH_ERROR;
    }
};

export const emailValidation: emailValidation = {
    required: REQUIRED_FIELD,
    pattern: {
        value: EMAIL_PATTERN,
        message: INVALID_EMAIL_FORMAT
    }
};

export const emailValidationNoRequired: emailValidation = {
    pattern: {
        value: EMAIL_PATTERN,
        message: INVALID_EMAIL_FORMAT
    }
};

export const priceRules = (maxAmount?: number): priceValidation => ({
    required: REQUIRED_FIELD,
    pattern: {
        value: /^(0|[1-9]\d*)(\.\d+)?$/, // Allow decimals
        message: 'Incorect decimal'
    },
    validate: (value: number) => {
        const num = Number(value);

        if (maxAmount != null && num > maxAmount) {
            return 'Enter an amount less than outstanding balance.';
        }

        return num > 0 ? true : REQUIRED_FIELD;
    }
});

export const phoneValidationNoRequired: Pick<RegisterOptions, 'validate'> = {
    validate: (value: string) => {
        if (!value) return true;
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length === 10 || PHONE_LENGTH_ERROR;
    }
};
