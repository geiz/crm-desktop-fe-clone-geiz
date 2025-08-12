import get from 'lodash/get';

export const getEnv = (key: string): string | undefined => get(import.meta.env, key);
