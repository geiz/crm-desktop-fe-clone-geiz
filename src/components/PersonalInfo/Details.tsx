import cn from 'classnames';

import React, { Fragment } from 'react';

import Block from 'components/Block/Block';

import { DATE_TIME_FORMAT } from 'constants/common';
import useTimezone from 'hooks/useTimezone';

import styles from './Details.module.css';

interface DetailsProps {
    section: { title: string; data: string | undefined | number }[];
    title: string;
}

const Details: React.FC<DetailsProps> = ({ section, title }) => {
    const { getTimezonedFormatedDate } = useTimezone();

    return (
        <Block className={styles.block}>
            <h2 className={cn(styles.title, 'h-16B')}>{title}</h2>

            <div className={cn(styles.infoField, 'body-14M')}>
                {section.map(
                    el =>
                        el.data && (
                            <Fragment key={el.title}>
                                <div className={cn(styles.sectionTitle, 'body-12M')}>{el.title}:</div>
                                <div className={styles.sectionValue}>
                                    {el.title === 'Created' ? getTimezonedFormatedDate(+el.data, DATE_TIME_FORMAT) : el.data}
                                </div>
                            </Fragment>
                        )
                )}
            </div>
        </Block>
    );
};

export default Details;
