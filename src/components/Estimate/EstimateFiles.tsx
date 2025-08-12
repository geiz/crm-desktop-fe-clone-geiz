import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import FileItem from 'components/UploadFiles/FileItem/FileItem';
import UploadFiles from 'components/UploadFiles/UploadFiles';

import { ACCEPTABLE_IMG_FORMATS } from 'constants/common';
import { ESTIMATE_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { BaseItem, FileImg, Method } from 'types/common';

interface EstimateFilesProps {
    uploadedFiles: BaseItem[];
    className?: string;
    isEditable: boolean;
}

const EstimateFiles: React.FC<EstimateFilesProps> = ({ uploadedFiles, className, isEditable }) => {
    const { id: estimateId } = useParams();
    const [files, setFiles] = useState<FileImg[] | BaseItem[]>(uploadedFiles);
    const [requestPendingId, setRequestPendingId] = useState<number>(0);
    const [uploadStatus, setUploadStatus] = useState<{ [fileId: number]: boolean }>({});

    const clearUploadStatusWithDelay = () => setTimeout(() => setUploadStatus({}), 500);

    const handleImg = async (file: File, base64: string) => {
        const isDuplicate = files.some(f => f.name === file.name);
        if (isDuplicate) {
            toast.info(`File ${file.name} already exist.`);
            return;
        }

        const tempId = Date.now();
        const tempFile: FileImg = { id: tempId, createdAt: tempId, name: file.name, url: URL.createObjectURL(file) };
        setFiles(prev => [...prev, tempFile]);

        // add estimate files
        if (estimateId) {
            setRequestPendingId(tempId);
            apiRequest<FileImg>({
                url: parametrizeURL(ESTIMATE_ENDPOINTS.files, { estimateId }),
                method: Method.POST,
                data: { name: file.name, file: base64 }
            })
                .then(resp => {
                    setFiles(prev => prev.map(file => (file.id === tempId ? resp : file)));
                    setRequestPendingId(0);
                    setUploadStatus(prev => ({ ...prev, [resp.id]: true }));
                    clearUploadStatusWithDelay();
                })
                .catch(err => {
                    setFiles(prev => prev.filter(f => f.id !== tempId));
                    setRequestPendingId(0);
                    toast.error(err.message);
                });
        }
    };

    const handleRemoveFile = (file: FileImg) => {
        if (estimateId) {
            setRequestPendingId(file.id);
            apiRequest({ url: parametrizeURL(ESTIMATE_ENDPOINTS.removeFile, { estimateId, fileId: file.id }), method: Method.DELETE })
                .catch(err => toast.error(err))
                .finally(() => setRequestPendingId(0));
        }

        const updated = files.filter(el => el.id !== file.id);
        setFiles(updated);
    };

    return (
        <UploadFiles accept={ACCEPTABLE_IMG_FORMATS} handleImg={handleImg} className={className} isEditable={isEditable}>
            {files.map(file => (
                <FileItem
                    key={`${file.id}-${encodeURIComponent(file.name)}`}
                    file={file as FileImg}
                    allFiles={files as FileImg[]}
                    isLoadingId={requestPendingId}
                    handleRemoveFile={handleRemoveFile}
                    uploadStatus={uploadStatus}
                    filesUrl={parametrizeURL(ESTIMATE_ENDPOINTS.files, { estimateId: `${estimateId}` })}
                />
            ))}
        </UploadFiles>
    );
};

export default EstimateFiles;
