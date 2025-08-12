import { Divider } from 'rsuite';

import Button from 'components/ui/Button';
import Dropdown from 'components/ui/Dropdown';

import { DropdownOption } from 'types/common';

import styles from './AddDivider.module.css';

interface AddDividerProps {
    addName: string;
    onAdd?: () => void;
    dropdownOptions?: DropdownOption[];
}

const AddDivider: React.FC<AddDividerProps> = ({ onAdd, addName, dropdownOptions }) => {
    return (
        <Divider className={styles.customDivider}>
            {dropdownOptions ? (
                <Dropdown
                    trigger={
                        <Button className={styles.dropDownBtn} btnStyle='text-btn-m' type='button' icon='plus-square'>
                            {addName}
                        </Button>
                    }
                    options={dropdownOptions}
                />
            ) : (
                <Button onClick={onAdd} btnStyle='text-btn-m' type='button' icon='plus-square'>
                    {addName}
                </Button>
            )}
        </Divider>
    );
};

export default AddDivider;
