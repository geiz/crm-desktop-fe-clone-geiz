import cn from 'classnames';

import { ChangeEvent, DragEvent, FC, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { UNKNOWN_ERROR } from 'constants/common';
import fileToBase64 from 'utils/fileToBase64';
import heicImgCheck from 'utils/heicImgCheck';
import { compressImageToSize } from 'utils/imageCompression';

import styles from './FileInput.module.css';

interface FileInputProps {
    accept: string;
    handleFile: (file: File, base64: string) => void;
    fileMaxSizeMB: number;
    disabled?: boolean;
    multiple?: boolean;
}

const FileInput: FC<FileInputProps> = ({ accept, handleFile, multiple = true, fileMaxSizeMB, disabled = false }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const validateFile = async (file: File): Promise<string | null> => {
        const MAX_SIZE_MB = fileMaxSizeMB; //10; // MB
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Convert MB to bytes
        const allowedFormats = accept.split(',');

        if (file.size > MAX_SIZE_BYTES) {
            toast.info(`File size should not exceed ${MAX_SIZE_MB} MB.`);
            return null;
        }

        if (!allowedFormats.includes(file.type)) {
            toast.info(`File ${file.name} has an invalid format.`);
            return null;
        }

        try {
            const base64 = await fileToBase64(file);
            return base64;
        } catch (error) {
            toast.error(UNKNOWN_ERROR);
            console.error('Error converting files to Base64:', error);
            return null;
        }
    };

    const uploadFiles = async (selectedFiles: FileList) => {
        const fileArray = Array.from(selectedFiles);

        await Promise.all(
            fileArray.map(async file => {
                try {
                    // Convert HEIC files first
                    const convertedFile = await heicImgCheck(file);
                    if (!convertedFile) return;

                    // Compress image files before validation
                    const compressedFile = convertedFile.type.startsWith('image/')
                        ? await compressImageToSize(convertedFile, 0.5) // Compress to max 500KB
                        : convertedFile;

                    // Validate and process the file
                    const base64 = await validateFile(compressedFile);
                    if (base64) handleFile(compressedFile, base64);
                } catch (error) {
                    console.error('Error processing file:', file.name, error);
                    toast.error(`Failed to process file ${file.name}`);
                }
            })
        );
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        uploadFiles(selectedFiles);
        event.target.value = '';
    };

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (!droppedFiles || droppedFiles.length === 0) return;

        uploadFiles(droppedFiles);
        setIsDragging(false);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(styles.documentUploader, { [styles.dragActive]: isDragging })}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}>
            <>
                <i className={cn(styles.uploadIcon, 'icon-cloud-arrow-up')} />
                <input
                    ref={fileInputRef}
                    type='file'
                    hidden
                    id='browse'
                    onChange={handleFileChange}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                />
                <span className={cn(styles.grey600, 'body-14R')}>
                    Drop files to upload or
                    <span className={cn(styles.browse, 'link-14')}>browse</span>
                </span>
            </>
        </div>
    );
};

export default FileInput;
