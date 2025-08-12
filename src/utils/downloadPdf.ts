import { toast } from 'react-toastify';

import axiosInstance from 'services/axiosInstance';

const downloadPdf = async (url: string, defaultFileName: string) => {
    try {
        const response = await axiosInstance.get(url, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition.split('=')[1].replace(/"/g, '');

        // create url and download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || defaultFileName;
        link.click();

        // remove url after download
        URL.revokeObjectURL(link.href);
    } catch (error) {
        toast.error('Failed to download PDF');
        console.error(error);
    }
};

export default downloadPdf;
