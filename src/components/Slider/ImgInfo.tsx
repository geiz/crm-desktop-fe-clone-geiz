import cn from 'classnames';
import dayjs from 'dayjs';

import { FC } from 'react';

import { DATE_ALPHABETICAL } from 'constants/common';
import { FileImg } from 'types/common';

import styles from './ImgInfo.module.css';

interface ImgInfoProps {
    img: FileImg;
    classNames?: string;
}

const ImgInfo: FC<ImgInfoProps> = ({ img, classNames }) => {
    return (
        <div className={styles.container}>
            <p className={cn(styles.name, 'body-12R', classNames)}>{img.name}</p>
            <p className={cn(styles.date, 'body-10M')}>{dayjs.unix(img.createdAt as number).format(DATE_ALPHABETICAL)}</p>
        </div>
    );
};

export default ImgInfo;
