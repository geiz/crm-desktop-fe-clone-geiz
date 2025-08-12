import cn from 'classnames';
import { Loader } from 'rsuite';

import Table from 'components/Table/Table';
import { TableCellColumn, TableCellFormat } from 'components/Table/types';
import Button from 'components/ui/Button';

import useSettingsEntity from 'hooks/useSettingsEntity';
import { ApiMethods, Field } from 'types/settingsTypes';

import styles from './CrudSettingsScreen.module.css';

interface CrudSettingsScreenProps {
    title: string;
    buttonText: string;
    btnWidth: string;
    apis: ApiMethods;
    itemName: string;
    columns: Array<{ key: string; label: string; format?: TableCellFormat }>;
    fields: Field[];
    gridTemplateColumns: string;
    itemLimit?: number;
}

const CrudSettingsScreen = ({
    title,
    buttonText,
    btnWidth,
    apis,
    itemName,
    columns,
    fields,
    gridTemplateColumns,
    itemLimit
}: CrudSettingsScreenProps) => {
    const {
        data,
        handleOpenModal,
        getActionsConfig,
        renderModal,
        isLoading,
        handleEdit,
        handleScroll,
        scrollRef,
        totalItemsCount,
        loadingTriggerRef,
        hasMore
    } = useSettingsEntity({
        apis,
        itemName,
        fields
    });

    const handleAddClick = () => handleOpenModal('add');
    const itemLimitReached = !!itemLimit && data.length >= itemLimit;

    return (
        <>
            <div className={styles.header}>
                <h2 className={cn(styles.title, 'h-16B')}>{title}</h2>
                <Button
                    disabled={itemLimitReached}
                    style={{ width: btnWidth }}
                    className={styles.addButton}
                    btnStyle='blue-l'
                    icon='plus'
                    onClick={handleAddClick}>
                    {buttonText}
                </Button>
            </div>
            <Table
                className={styles.table}
                columns={columns as TableCellColumn[]}
                data={data}
                gridTemplateColumns={gridTemplateColumns}
                getActionsConfig={getActionsConfig}
                onRowClick={handleEdit}
                onScroll={handleScroll}
                totalItems={totalItemsCount}
                scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
                loadingTriggerRef={loadingTriggerRef}
                hasMore={hasMore}
                showInlineLoader={isLoading}
                showPagination
            />
            {renderModal()}
            {isLoading && <Loader center size='lg' />}
        </>
    );
};

export default CrudSettingsScreen;
