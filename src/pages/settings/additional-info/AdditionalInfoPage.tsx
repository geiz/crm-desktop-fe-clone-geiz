import cn from 'classnames';
import { Loader } from 'rsuite';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { COMPANY_DOCUMENT_TITLES, COMPANY_INFO_NO_TEXT } from 'constants/common';
import { SETTINGS_ENDPOINTS } from 'constants/endpoints';
import { APP_ROUTES } from 'constants/routes';
import { parametrizeRouterURL } from 'routes/utils';
import { apiRequest } from 'services/apiUtils';
import { Method } from 'types/common';

import styles from './AdditionalInfoPage.module.css';

type DocumentItem = {
    name: string;
    text: string;
    expanded: boolean;
    title?: string;
};

const AdditionalInfoPage = () => {
    const [items, setItems] = useState<DocumentItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const textRefs = useRef<Record<string, HTMLParagraphElement | null>>({});

    useEffect(() => {
        setIsLoading(true);
        apiRequest<{ [key: string]: string }>({
            url: SETTINGS_ENDPOINTS.documents,
            method: Method.GET
        })
            .then(res => {
                const documents: DocumentItem[] = Object.keys(res).map(key => ({
                    name: key,
                    text: res[key] ?? '',
                    expanded: false,
                    title: COMPANY_DOCUMENT_TITLES[key as keyof typeof COMPANY_DOCUMENT_TITLES] ?? 'Unknown Title'
                }));

                setItems(documents);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleShowBtn = useCallback((item: DocumentItem) => {
        setItems(prevItems =>
            prevItems.map(el => {
                if (el.name !== item.name) return el;

                const textEl = textRefs.current[el.name];
                const newExpanded = !el.expanded;
                if (textEl) {
                    textEl.style.height = newExpanded ? `${textEl.scrollHeight}px` : '8rem';
                }

                return { ...el, expanded: newExpanded };
            })
        );
    }, []);

    return (
        <div className={styles.container}>
            <h3 className={cn(styles.title, 'h-16B')}>Additional Information</h3>
            {items.map(item => (
                <div key={item.name} className={styles.item}>
                    <div className={styles.itemContentWrapper}>
                        <h4 className={cn(styles.itemTitle, 'body-14M')}>{item.title}</h4>
                        <p
                            ref={el => {
                                if (el) textRefs.current[item.name] = el;
                            }}
                            className={cn(styles.itemText, 'body-12R')}>
                            {item.text || COMPANY_INFO_NO_TEXT}
                        </p>
                        {String(item.text).length > 150 && (
                            <button className={cn(styles.showMoreBtn, 'body-12R')} onClick={() => handleShowBtn(item)}>
                                Show {item.expanded ? 'Less' : 'More'}
                                <i className={cn(styles.iconDropDown, 'icon-drop-down-small', { [styles.active]: item.expanded })} />
                            </button>
                        )}
                    </div>
                    <Link
                        to={parametrizeRouterURL(item.text ? APP_ROUTES.settings.editDocument : APP_ROUTES.settings.addDocument, {
                            name: item.name
                        })}>
                        <i className={cn(styles.iconPlus, `icon-${item.text ? 'edit' : 'plus-square'}`)} />
                    </Link>
                </div>
            ))}
            {isLoading && <Loader center size='lg' />}
        </div>
    );
};

export default AdditionalInfoPage;
