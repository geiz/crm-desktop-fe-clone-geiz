const getDirtyValues = (dirtyFields: object | boolean, allValues: object): object => {
    // If *any* item in an array was modified, the entire array must be submitted, because there's no way to indicate
    // "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
    if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;

    return Object.fromEntries(Object.keys(dirtyFields).map(key => [key, getDirtyValues(dirtyFields[key], allValues[key])]));
};

export default getDirtyValues;
