import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings, subscribeToSiteSettings } from '../lib/settingsService';

interface SettingsContextType {
    settings: SiteSettings;
    loading: boolean;
}

const defaultSettings: SiteSettings = {
    siteName: 'wbify',
    adminEmail: 'admin@wbify.com'
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
            setSettings(newSettings);
            setLoading(false);
            
            // Update favicon dynamically
            if (newSettings.faviconUrl) {
                const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = newSettings.faviconUrl;
                document.getElementsByTagName('head')[0].appendChild(link);
            }

            // Update document title if site name changes (optional, but good UX)
            // document.title = newSettings.siteName; // Might conflict with page-specific titles
        });

        return () => unsubscribe();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
