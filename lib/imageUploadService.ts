/**
 * Uploads an image file to Vercel Blob storage via a serverless function.
 * @param file - The image file to upload
 * @param folder - The folder path (optional, used in filename)
 * @returns Promise<string> - The download URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'products'): Promise<string> => {
    try {
        // Validate file size (limit to 10MB for better UX)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error('Image size must be less than 10MB.');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file.');
        }

        // Generate a clean filename: folder/timestamp-originalName
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
        const filename = `${folder}/${Date.now()}-${cleanFileName}`;

        // Upload to our internal API endpoint which uses @vercel/blob
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(file.type)}`, {
            method: 'POST',
            body: file, // Send the file directly as the body (handled as stream by Vercel)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.url) {
            throw new Error('Upload failed: Invalid response from storage provider');
        }

        // Return the Vercel Blob URL
        return data.url;
    } catch (error: any) {
        console.error('Error uploading image to Vercel Blob:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('size')) {
            throw error; 
        } else if (error.message.includes('image file')) {
            throw error;
        }
        
        throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
};
