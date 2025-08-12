import cn from 'classnames';

import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Modal from 'components/Modals/Modal';
import ImgInfo from 'components/Slider/ImgInfo';
import Button from 'components/ui/Button';
import Tooltip from 'components/ui/Tooltip';

import useModal from 'hooks/useModal';
import { getPaymentFile } from 'services/invoiceService';
import { FileImg } from 'types/common';
import { InvoicePayment } from 'types/invoiceTypes';

import styles from './FileCell.module.css';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString(); // localy - works; dev - doesn't
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`; // localy - doesn't; dev - not checked
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; // localy - works // dev - works;
interface FileCellProps {
    rowData: InvoicePayment;
}

const FileCell = ({ rowData }: FileCellProps) => {
    const { jobId } = useParams();
    const { isOpen, openModal, closeModal } = useModal();
    const [paymentFile, setPaymentFile] = useState<FileImg | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getFileUrl = () => {
        if (jobId) {
            setIsLoading(true);
            getPaymentFile(rowData.id, +jobId)
                .then(resp => {
                    setPaymentFile(resp);
                    openModal();
                })
                .catch(err => toast.error(err.message))
                .finally(() => setIsLoading(false));
        }
    };

    if (!rowData.file)
        return (
            <Tooltip text='No file'>
                <i className={cn(styles.fileIcon, 'icomoon icon-no-file')} />
            </Tooltip>
        );

    return (
        <div className={styles.cellWrap}>
            <Tooltip text='Open file'>
                <Button className={styles.fileIcon} area-label='open file' isLoading={isLoading} onClick={getFileUrl} icon='file-text' />
            </Tooltip>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeModal}>
                    <div className={styles.modalContainer}>
                        <h4 className={cn(styles.modalTitle, 'h-16B')}>Uploaded File</h4>

                        {isOpen && paymentFile && (
                            <div className={styles.contentWrap}>
                                <div className={styles.fileWrap}>
                                    {paymentFile.name.endsWith('.pdf') ? (
                                        <Document className={styles.document} file={paymentFile.url}>
                                            <Page pageNumber={1} renderTextLayer={false} />
                                        </Document>
                                    ) : (
                                        <img src={paymentFile.url} className={'img-contain'} />
                                    )}
                                </div>
                                <ImgInfo img={paymentFile} />
                            </div>
                        )}

                        <Button btnStyle='outlined-s' className={styles.closeSliderBtn} onClick={closeModal} aria-label='Close modal'>
                            Close
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default FileCell;
