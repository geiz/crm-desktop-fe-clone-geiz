import { useEffect, useState } from 'react';

import FileItem from 'components/UploadFiles/FileItem/FileItem';
import UploadFiles from 'components/UploadFiles/UploadFiles';

import { ACCEPTABLE_IMG_FORMATS } from 'constants/common';
import { BaseItem, FileImg } from 'types/common';

import styles from './PaymentFiles.module.css';

interface PaymentFilesProps {
    addFile: (file: Record<string, string>) => void;
    removeFile: () => void;
    resetKey?: string | number;
}

const PaymentFiles = ({ addFile, removeFile, resetKey }: PaymentFilesProps) => {
    const [file, setFile] = useState<FileImg | BaseItem | null>(null);
    const [requestPendingId, setRequestPendingId] = useState<number>(0);

    useEffect(() => {
        setFile(null);
    }, [resetKey]);

    const clearPendingIdWithDelay = () => setTimeout(() => setRequestPendingId(0), 500);

    const handleImg = async (newFile: File, base64: string) => {
        const tempId = Date.now();
        const tempFile: FileImg = { id: tempId, createdAt: tempId, name: newFile.name, url: URL.createObjectURL(newFile) };
        setFile(tempFile);

        // set form value
        if (addFile) {
            addFile({ name: newFile.name, file: base64 });
            setRequestPendingId(tempId);
            clearPendingIdWithDelay();
        }
    };

    const handleRemoveFile = () => {
        if (removeFile) removeFile();
        setFile(null);
    };

    return (
        <UploadFiles
            accept={`${ACCEPTABLE_IMG_FORMATS},application/pdf`}
            handleImg={handleImg}
            isEditable={true}
            multiple={false}
            className={styles.fileContainer}>
            {file && (
                <FileItem
                    key={`${file.id}-${encodeURIComponent(file.name)}`}
                    file={file as FileImg}
                    allFiles={[file] as FileImg[]}
                    isLoadingId={requestPendingId}
                    handleRemoveFile={handleRemoveFile}
                    hasPreview={false}
                />
            )}
        </UploadFiles>
    );
};

export default PaymentFiles;
