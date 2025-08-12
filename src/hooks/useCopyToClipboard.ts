import { useState } from 'react';

const useCopyToClipboard = (text?: string) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        if (!text) return;

        navigator.clipboard.writeText(text);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return {
        isCopied,
        copyToClipboard
    };
};

export default useCopyToClipboard;
