import { capitalizeFirst } from './capitalizeFirst';

const capitalizeString = (value: string) =>
    value
        .toLowerCase()
        .split(' ')
        .map(word => capitalizeFirst(word))
        .join(' ');

export default capitalizeString;
