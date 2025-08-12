const formatLabel = (label: string): string => {
    return label.replace(/_/g, ' ').toLowerCase();
};

export default formatLabel;
