import heic2any from 'heic2any';

import { toast } from 'react-toastify';

const heicImgCheck = async (file: File) => {
    const toType = 'image/jpeg';

    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        try {
            const convertedBlob = (await heic2any({
                blob: file,
                toType
            })) as Blob;

            return new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpeg'), { type: toType });
        } catch (error) {
            console.error('HEIC conversion failed', error);
            toast.error(`Cannot download file ${file.name}.`);
            return null;
        }
    }

    return file;
};

export default heicImgCheck;
