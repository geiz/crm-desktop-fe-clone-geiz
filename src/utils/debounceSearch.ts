// prevent search api calls on too fast user typing
const debounceSearch = <T extends (...args: never[]) => void>(func: T, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export default debounceSearch;
