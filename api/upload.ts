import { put } from '@vercel/blob';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { filename, contentType } = req.query;
        
        if (!filename) {
            return res.status(400).json({ message: 'Filename is required' });
        }

        // The request body is the file content
        const blob = await put(filename, req, {
            access: 'public',
            contentType: contentType,
        });

        return res.status(200).json(blob);
    } catch (error: any) {
        console.error('Vercel Blob upload error:', error);
        return res.status(500).json({ message: error.message });
    }
}

// Config for Vercel to handle body as stream
export const config = {
    api: {
        bodyParser: false,
    },
};
