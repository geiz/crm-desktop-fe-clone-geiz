import cn from 'classnames';

import React from 'react';

import { FileInput } from 'components/ui/Input';

import styles from './UploadFiles.module.css';

interface UploadFilesProps {
    accept: string;
    handleImg: (file: File, base64: string) => void;
    className?: string;
    isEditable?: boolean;
    children: React.ReactNode;
    multiple?: boolean;
    hasPreview?: boolean;
}

const UploadFiles: React.FC<UploadFilesProps> = ({ accept, className, handleImg, isEditable = false, multiple = true, children }) => {
    return (
        <div className={cn(styles.container, { [styles.disabled]: !isEditable }, className)}>
            {isEditable && <FileInput fileMaxSizeMB={10} accept={accept} handleFile={handleImg} multiple={multiple} />}

            <ul className={styles.filesList}>{children}</ul>
        </div>
    );
};

export default UploadFiles;
