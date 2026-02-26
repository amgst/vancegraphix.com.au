import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings, subscribeToSiteSettings } from '../lib/settingsService';

interface SettingsContextType {
    settings: SiteSettings;
    loading: boolean;
}

const defaultSettings: SiteSettings = {
    siteName: 'Vance Graphix & Print (VGP)',
    adminEmail: 'ahmed@vancegraphix.com.au',
    logoUrl: 'https://nbyomoqura0jkgxd.public.blob.vercel-storage.com/vgp%20logo%20horizontal.png'
};

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    loading: true
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToSiteSettings((newSettings) => {
            const mergedSettings: SiteSettings = {
                ...defaultSettings,
                ...newSettings
            };

            setSettings(mergedSettings);
            setLoading(false);

            if (mergedSettings.faviconUrl) {
                const existing =
                    (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
                    document.createElement('link');
                existing.type = 'image/x-icon';
                existing.rel = 'shortcut icon';
                existing.href = mergedSettings.faviconUrl;
                document.getElementsByTagName('head')[0].appendChild(existing);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
