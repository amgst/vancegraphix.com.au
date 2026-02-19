/**
 * Uploads an image file using ImgBB API (no CORS issues!)
 * @param file - The image file to upload
 * @param folder - The folder path in storage (e.g., 'ready-sites') - kept for compatibility
 * @returns Promise<string> - The download URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'ready-sites'): Promise<string> => {
    try {
        // ImgBB API key - Get a free one from https://api.imgbb.com/
        // For now, using a placeholder. You'll need to add your own API key.
        const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY_HERE';
        
        if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
            throw new Error('Please set VITE_IMGBB_API_KEY in your .env file. Get a free API key from https://api.imgbb.com/');
        }

        // Validate file size (ImgBB allows up to 32MB, but we'll limit to 10MB for better UX)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error('Image size must be less than 10MB.');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file.');
        }

        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:image/...;base64, prefix
                const base64Data = result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Upload to ImgBB
        const formData = new FormData();
        formData.append('key', IMGBB_API_KEY);
        formData.append('image', base64);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
            // No CORS issues - ImgBB allows cross-origin requests
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success || !data.data?.url) {
            throw new Error('Upload failed: Invalid response from ImgBB');
        }

        // Return the image URL
        return data.data.url;
    } catch (error: any) {
        console.error('Error uploading image:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('API key')) {
            throw new Error('Image upload is not configured. Please contact the administrator.');
        } else if (error.message.includes('size')) {
            throw error; // Already user-friendly
        } else if (error.message.includes('image file')) {
            throw error; // Already user-friendly
        }
        
        throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
};

