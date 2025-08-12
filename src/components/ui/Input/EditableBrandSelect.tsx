import EditableMultiSelect, { EditableMultiSelectProps } from './EditableMultiSelect';

export interface EditableBrandSelectProps extends Omit<EditableMultiSelectProps, 'placeholder'> {
    placeholder?: string;
}

const EditableBrandSelect = ({ placeholder = 'Add brand...', ...props }: EditableBrandSelectProps) => {
    return <EditableMultiSelect placeholder={placeholder} {...props} />;
};

export default EditableBrandSelect;
