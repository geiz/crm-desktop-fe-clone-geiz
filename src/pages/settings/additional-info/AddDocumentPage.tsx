import CompanyInfoForm from './CompanyInfoForm';
import cn from 'classnames';

import { useParams } from 'react-router-dom';

import { COMPANY_DOCUMENT_TITLES } from 'constants/common';

import styles from './AddDocumentPage.module.css';

type ItemType = {
    text: string;
    name: string;
    title: string;
};

const AddDocumentPage = () => {
    const { name = '' } = useParams<{ name?: string }>();
    const title = COMPANY_DOCUMENT_TITLES[name as keyof typeof COMPANY_DOCUMENT_TITLES] ?? 'Unknown';

    const item: ItemType = { text: '', name, title };

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Add Additional Information</h3>
            <h4 className={cn(styles.itemTitle, 'body-14M')}>{item.title}</h4>
            <CompanyInfoForm item={item} />
        </div>
    );
};

export default AddDocumentPage;
