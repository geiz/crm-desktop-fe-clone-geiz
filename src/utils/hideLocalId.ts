export const isIdLocal = (id: string | number) => id.toString().includes('local-');

export const hideLocalId = <T extends { id: string | number }>({ id, ...item }: T): Omit<T, 'id'> & { id?: number } =>
    isIdLocal(id) ? item : { ...item, id };
