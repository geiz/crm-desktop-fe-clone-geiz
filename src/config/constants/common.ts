// Messages and errors
export const UNKNOWN_ERROR = 'Something went wrong, please try again.';
export const INVALID_INPUT = 'Invalid input.';
export const REQUIRED_FIELD = 'Required field.';
export const INVALID_EMAIL_FORMAT = 'Invalid email format. Please check your input.';
export const REQUIRED_EMAIL_OR_PHONE = 'Phone number or email is required.';
export const ADDRESS_AUTOCOMPLETE_ERROR = 'Incorrect address. Please check the input and try again.';
export const ADDRESS_NOT_FOUND = 'Address not found. Please check the input and try again.';
export const COMPANY_INFO_NO_TEXT = 'There is currently no content in this section. You can add information.';
export const FILE_NOT_FOUND = 'File not found.';
export const PHONE_LENGTH_ERROR = 'Phone number must be 10 digits.';
export const ONLY_DIGITS = 'Only digits allowed.';
export const UPPERCASE_AND_DIGITS = 'Only uppercase letters and digits allowed.';
export const END_TIME_AFTER_START_ERROR = 'Must be after start time';
export const START_TIME_BEFORE_END_ERROR = 'Must be before end time';
export const CANNOT_SELECT_PAST_TIME = 'Start time cannot be in the past';
export const INVALID_AW_TIME = 'Start must be before end';

// Company documents
export const COMPANY_DOCUMENT_TITLES = {
    terms: 'Terms and Conditions',
    agreement: 'Information for invoices, receipts, and estimates'
} as const;
export type DocumentKey = keyof typeof COMPANY_DOCUMENT_TITLES;

// Acceptable image formats
export const ACCEPTABLE_IMG_FORMATS = 'image/jpeg,image/jpg,image/png,image/heic';

// Date formats
export const DATE_FORMAT = 'MM/DD/YYYY'; // dayjs
export const DATEPICKER_FORMAT = 'MM/dd/yyyy'; // rsuit
export const DATE_TIME_FORMAT = 'MM/DD/YYYY, hh:mm A';
export const TIME_FORMAT_A = 'h:mm A';
export const DATE_ALPHABETICAL = 'MMM DD, YYYY';

// Validation
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const ONLY_DIGITS_PATTERN = /^\d+$/;
export const UPPERCASE_AND_DIGITS_PATTERN = /^[A-Z0-9]*$/;
export const POSTAL_CODE_PATTERN = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/; //-> 6 length
export const ZIP_CODE_PATTERN = /^\d{5}$/; // 5 digits
export const PHONE_MASK = {
    mask: '(___) ___-____',
    replacement: { _: /\d/ }
};

// Limits
export const LENGTH_S = 250;
export const LENGTH_M = 1000;
export const LENGTH_L = 2000;
export const LIMIT = 20;
