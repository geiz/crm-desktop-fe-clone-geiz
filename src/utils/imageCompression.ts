interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
}

/**
 * Compresses an image file using canvas
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise that resolves to compressed file
 */
export const compressImage = async (file: File, options: CompressionOptions = {}): Promise<File> => {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, maxSizeMB = 2 } = options;

    // Return original file if it's not an image
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // Return original file if it's already small enough
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size <= maxSizeBytes) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height;

                if (width > height) {
                    width = Math.min(width, maxWidth);
                    height = width / aspectRatio;
                } else {
                    height = Math.min(height, maxHeight);
                    width = height * aspectRatio;
                }
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress image
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                blob => {
                    if (!blob) {
                        reject(new Error('Failed to compress image'));
                        return;
                    }

                    // Create new file with compressed blob
                    const compressedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: file.lastModified
                    });

                    resolve(compressedFile);
                },
                file.type,
                quality
            );
        };

        img.onerror = () => {
            reject(new Error('Failed to load image for compression'));
        };

        img.src = URL.createObjectURL(file);
    });
};

/**
 * Compresses image with progressive quality reduction if needed
 * @param file - The image file to compress
 * @param targetSizeMB - Target size in MB
 * @returns Promise that resolves to compressed file
 */
export const compressImageToSize = async (file: File, targetSizeMB: number = 2): Promise<File> => {
    if (!file.type.startsWith('image/')) {
        return file;
    }

    const targetSizeBytes = targetSizeMB * 1024 * 1024;

    // If already small enough, return original
    if (file.size <= targetSizeBytes) {
        return file;
    }

    let quality = 0.9;
    let compressedFile = file;
    let attempts = 0;
    const maxAttempts = 5;

    // Progressive quality reduction
    while (compressedFile.size > targetSizeBytes && attempts < maxAttempts && quality > 0.1) {
        try {
            compressedFile = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1080,
                quality,
                maxSizeMB: targetSizeMB
            });

            quality -= 0.2;
            attempts++;
        } catch (error) {
            console.warn('Image compression attempt failed:', error);
            break;
        }
    }

    return compressedFile;
};
