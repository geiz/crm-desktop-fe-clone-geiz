import cn from 'classnames';

import { FC, useState } from 'react';
import { toast } from 'react-toastify';

import Modal from 'components/Modals/Modal';
import Slider from 'components/Slider/Slider';
import Button from 'components/ui/Button';

import { DATE_TIME_FORMAT, FILE_NOT_FOUND } from 'constants/common';
import useModal from 'hooks/useModal';
import useTimezone from 'hooks/useTimezone';
import { apiRequest } from 'services/apiUtils';
import { FileImg, Method } from 'types/common';

import styles from './FileItem.module.css';

interface FileItemProps {
    file: FileImg;
    allFiles: FileImg[];
    handleRemoveFile: (file: FileImg) => void;
    isLoadingId: number;
    uploadStatus?: { [id: number]: boolean };
    disabled?: boolean;
    /**
     * get files url
     */
    filesUrl?: string;
    hasPreview?: boolean;
}

const FileItem: FC<FileItemProps> = ({
    handleRemoveFile,
    filesUrl,
    file,
    allFiles,
    isLoadingId,
    hasPreview = true,
    uploadStatus,
    disabled = false
}) => {
    const { getTimezonedFormatedDate } = useTimezone();

    const { isOpen, openModal, closeModal } = useModal();

    const [sliderInitIndex, setSliderInitIndex] = useState<number>(0);
    const [imageData, setImageData] = useState<FileImg[] | null>(null);

    const isRequestPending = isLoadingId === file.id;
    const isSuccesNotification = uploadStatus ? uploadStatus[file.id] : undefined;

    const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        handleRemoveFile(file);
    };

    const handleFileClick = () => {
        if (!hasPreview) return;

        if (filesUrl) {
            //  means we open slider with actual job files
            apiRequest<FileImg[]>({ url: filesUrl, method: Method.GET })
                .then(resp => {
                    const selectedImgIndex = resp.findIndex(el => el.id === file.id);
                    if (selectedImgIndex !== -1) {
                        setSliderInitIndex(selectedImgIndex);
                        setImageData(resp);
                        openModal();
                    } else toast.error(FILE_NOT_FOUND);
                })
                .catch(err => toast.error(err.message));
        } else {
            //  means we open slider to check files (preview) for uploading on create job page
            const selectedImgIndex = allFiles.findIndex(el => el.id === file.id);
            if (selectedImgIndex !== -1) {
                setSliderInitIndex(selectedImgIndex);
                setImageData(allFiles);
                openModal();
            } else toast.error(FILE_NOT_FOUND);
        }
    };

    return (
        <>
            <li
                onClick={handleFileClick}
                className={cn(styles.fileItem, {
                    [styles.bgGrey100]: isRequestPending || isSuccesNotification,
                    [styles.disabled]: disabled,
                    ['pointer']: hasPreview
                })}>
                <div className={styles.fileInfoWrap}>
                    {(isRequestPending || isSuccesNotification) && <i className={cn(styles.fileIcon, 'icon-file')} />}

                    <div className='body-12R'>
                        {file.name}
                        <div className={cn(styles.grey600, 'body-10R')}>
                            {file.size
                                ? `${(file.size / 1024).toFixed(2)}KB`
                                : getTimezonedFormatedDate(file.createdAt as number, DATE_TIME_FORMAT)}
                        </div>
                    </div>
                </div>

                {!isRequestPending && !isSuccesNotification && (
                    <button type='button' className={cn(styles.removeButton)} onClick={remove}>
                        <i className='icon-trash' />
                    </button>
                )}

                {isRequestPending && <div className={styles.loaderIcon} />}

                {isSuccesNotification && <i className={cn(styles.checkIcon, 'icon-check-circle')} />}
            </li>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeModal}>
                    <div className={styles.modalContainer}>
                        <h4 className={cn(styles.modalTitle, 'h-16B')}>Uploaded Files</h4>
                        {imageData && <Slider imageData={imageData} activeIndex={sliderInitIndex} />}
                        <Button btnStyle='outlined-s' className={styles.end} onClick={closeModal} aria-label='Close modal'>
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default FileItem;
