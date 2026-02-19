import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/**
 * Optimizes an image file by resizing it to a maximum width and compressing it.
 */
export const optimizeImage = async (file: Blob | File, maxWidth: number = 1000, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Only resize if width is greater than maxWidth
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob (using jpeg for better compression)
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas to Blob failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = () => reject(new Error('Failed to load image for optimization'));
        };
        reader.onerror = () => reject(new Error('Failed to read file for optimization'));
    });
};

/**
 * Uploads a file to Firebase Storage with progress tracking and optional optimization.
 */
export const uploadFileWithProgress = async (
    file: File | Blob, 
    path: string, 
    onProgress?: (progress: number) => void,
    shouldOptimize: boolean = true
): Promise<string> => {
    let fileToUpload = file;

    // Optimize if it's an image and requested
    if (shouldOptimize && (file instanceof File || file instanceof Blob) && file.type.startsWith('image/')) {
        try {
            fileToUpload = await optimizeImage(file);
        } catch (error) {
            console.warn("Image optimization failed, uploading original:", error);
        }
    }

    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) {
                    onProgress(Math.round(progress));
                }
            }, 
            (error) => {
                console.error("Error uploading file:", error);
                reject(error);
            }, 
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

/**
 * Downloads an image from a URL and uploads it to Firebase Storage with optimization.
 */
export const uploadFromUrl = async (url: string, path: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        // The optimization now happens inside uploadFileWithProgress
        return await uploadFileWithProgress(blob, path, undefined, true);
    } catch (error) {
        console.error("Error importing image from URL:", error);
        throw error;
    }
};

/**
 * Generates a unique filename for storage to avoid collisions.
 */
export const generateUniqueFileName = (originalName: string): string => {
    const timestamp = Date.now();
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    return `${timestamp}-${cleanName}`;
};
