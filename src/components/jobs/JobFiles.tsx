import dayjs from 'dayjs';

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import FileItem from 'components/UploadFiles/FileItem/FileItem';
import UploadFiles from 'components/UploadFiles/UploadFiles';

import { ACCEPTABLE_IMG_FORMATS } from 'constants/common';
import { JOB_ENDPOINTS } from 'constants/endpoints';
import { apiRequest } from 'services/apiUtils';
import { parametrizeURL } from 'services/utils';
import { BaseItem, FileImg, Method } from 'types/common';

interface JobFilesProps {
    uploadedFiles: BaseItem[];
    disabled?: boolean;
    addFile?: (file: Record<string, string>) => void;
    removeFile?: (name: string) => void;
    className?: string;
}

const JobFiles: React.FC<JobFilesProps> = ({ disabled = false, addFile, removeFile, uploadedFiles = [], className }) => {
    const { jobId } = useParams();
    const [files, setFiles] = useState<FileImg[] | BaseItem[]>(uploadedFiles);
    const [requestPendingId, setRequestPendingId] = useState<number>(0);
    const [uploadStatus, setUploadStatus] = useState<{ [fileId: number]: boolean }>({});

    const clearUploadStatusWithDelay = () => setTimeout(() => setUploadStatus({}), 500);

    const handleImg = async (file: File, base64: string) => {
        if (disabled) return;

        const isDuplicate = files.some(f => f.name === file.name);
        if (isDuplicate) {
            toast.info(`File ${file.name} already exist.`);
            return;
        }

        const tempId = dayjs().unix();
        const tempFile: FileImg = { id: tempId, createdAt: tempId, name: file.name, url: URL.createObjectURL(file) };
        setFiles(prev => [...prev, tempFile]);

        // means we edit job files
        if (jobId) {
            setRequestPendingId(tempId);
            apiRequest<FileImg>({
                url: parametrizeURL(JOB_ENDPOINTS.files, { jobId }),
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
        // means we create an entity with files
        else if (addFile) addFile({ name: file.name, file: base64 });
    };

    const handleRemoveFile = (file: FileImg) => {
        if (disabled) return;

        // means we edit job files
        if (jobId) {
            setRequestPendingId(file.id);
            apiRequest({ url: parametrizeURL(JOB_ENDPOINTS.removeFile, { jobId, fileId: file.id }), method: Method.DELETE })
                .catch(err => toast.error(err))
                .finally(() => setRequestPendingId(0));
        }
        // means we create a job with files and modifying there not uploaded files
        else if (removeFile) removeFile(file.name);

        const updated = files.filter(el => el.id !== file.id);
        setFiles(updated);
    };

    return (
        <UploadFiles accept={ACCEPTABLE_IMG_FORMATS} handleImg={handleImg} isEditable={!disabled} className={className}>
            {files.map(file => (
                <FileItem
                    key={`${file.id}-${encodeURIComponent(file.name)}`}
                    file={file as FileImg}
                    allFiles={files as FileImg[]}
                    isLoadingId={requestPendingId}
                    handleRemoveFile={handleRemoveFile}
                    uploadStatus={uploadStatus}
                    disabled={disabled}
                    filesUrl={jobId ? parametrizeURL(JOB_ENDPOINTS.files, { jobId: String(jobId) }) : undefined}
                />
            ))}
        </UploadFiles>
    );
};

export default JobFiles;
