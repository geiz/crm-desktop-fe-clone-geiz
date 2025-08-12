import CompanyInfoForm from './CompanyInfoForm';
import cn from 'classnames';
import { Loader } from 'rsuite';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { COMPANY_DOCUMENT_TITLES, DocumentKey } from 'constants/common';
import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { Method } from 'types/common';
import { CompanyDocument } from 'types/settingsTypes';

import styles from './EditDocumentPage.module.css';

const EditInfo = () => {
    const { name } = useParams<{ name: DocumentKey }>();
    const [item, setItem] = useState<CompanyDocument | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!name) return;

        setIsLoading(true);
        apiRequest<Record<string, string>>({
            url: SETTINGS_ENDPOINTS.documents,
            method: Method.GET
        })
            .then(response => {
                setItem({
                    name,
                    title: COMPANY_DOCUMENT_TITLES[name],
                    text: response[name] || ''
                });
            })
            .finally(() => setIsLoading(false));
    }, [name]);

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Edit Additional Information</h3>
            {item && (
                <>
                    <h4 className={cn(styles.itemTitle, 'body-14M')}>{item.title}</h4>
                    <CompanyInfoForm item={item} />
                </>
            )}
            {isLoading && <Loader size='lg' center />}
        </div>
    );
};

export default EditInfo;
