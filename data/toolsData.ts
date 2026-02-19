import { Wrench, Code, Palette, Zap, Globe, Database } from 'lucide-react';

export interface Tool {
    id: string;
    name: string;
    description: string;
    url: string;
    iconName: string; // Storing icon name as string to save in LocalStorage
    category: 'Development' | 'Design' | 'Productivity' | 'Other';
}

export const TOOLS_SEED_DATA: Tool[] = [

    {
        id: '4',
        name: 'Animotion',
        description: 'Create stunning animations for your web projects.',
        url: 'https://animotion.wbifytools.com/',
        iconName: 'Zap',
        category: 'Design'
    },
    {
        id: '5',
        name: 'Job Portal',
        description: 'A comprehensive job portal for finding and posting jobs.',
        url: 'https://job-portal-bzv4.vercel.app/',
        iconName: 'Globe',
        category: 'Productivity'
    }
];

// Helper to get Icon component by name
export const getIconByName = (name: string) => {
    const icons: { [key: string]: any } = {
        Wrench, Code, Palette, Zap, Globe, Database
    };
    return icons[name] || Wrench;
};
