import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSettings } from '../../components/SettingsProvider';
import { updateSiteSettings } from '../../lib/settingsService';
import { uploadImage } from '../../lib/imageUploadService';
import { Loader2, Upload, Save, Image as ImageIcon } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const { settings, loading } = useSettings();
    const [formData, setFormData] = useState({
        siteName: '',
        adminEmail: '',
        logoUrl: '',
        faviconUrl: '',
        googleAnalyticsId: '',
        googleTagManagerId: '',
        googleSiteVerification: '',
        socialUrls: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        }
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

    useEffect(() => {
        if (!loading && settings) {
            setFormData({
                siteName: settings.siteName || '',
                adminEmail: settings.adminEmail || '',
                logoUrl: settings.logoUrl || '',
                faviconUrl: settings.faviconUrl || '',
                googleAnalyticsId: settings.googleAnalyticsId || '',
                googleTagManagerId: settings.googleTagManagerId || '',
                googleSiteVerification: settings.googleSiteVerification || '',
                socialUrls: {
                    facebook: settings.socialUrls?.facebook || '',
                    twitter: settings.socialUrls?.twitter || '',
                    instagram: settings.socialUrls?.instagram || '',
                    linkedin: settings.socialUrls?.linkedin || ''
                }
            });
        }
    }, [settings, loading]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSiteSettings(formData);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLogo(true);
        try {
            const url = await uploadImage(file, 'settings');
            setFormData(prev => ({ ...prev, logoUrl: url }));
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Failed to upload logo.');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingFavicon(true);
        try {
            const url = await uploadImage(file, 'settings');
            setFormData(prev => ({ ...prev, faviconUrl: url }));
        } catch (error) {
            console.error('Error uploading favicon:', error);
            alert('Failed to upload favicon.');
        } finally {
            setIsUploadingFavicon(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-slate-900" size={32} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-gray-500">Manage your account and website settings.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-2xl">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-slate-900">General Settings</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
                        <input
                            type="text"
                            value={formData.siteName}
                            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                        <input
                            type="email"
                            value={formData.adminEmail}
                            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website Logo</label>
                        <div className="flex items-start gap-4">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="text-gray-400" size={32} />
                                )}
                                {isUploadingLogo && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <Upload size={18} />
                                    Upload Logo
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleLogoUpload}
                                        disabled={isUploadingLogo}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Recommended size: 200x50px. PNG or SVG preferred.</p>
                            </div>
                        </div>
                    </div>

                    {/* Favicon Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                {formData.faviconUrl ? (
                                    <img src={formData.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="text-gray-400" size={20} />
                                )}
                                {isUploadingFavicon && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                                    <Upload size={18} />
                                    Upload Favicon
                                    <input 
                                        type="file" 
                                        accept="image/x-icon,image/png,image/svg+xml" 
                                        className="hidden" 
                                        onChange={handleFaviconUpload}
                                        disabled={isUploadingFavicon}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Recommended size: 32x32px or 64x64px. ICO, PNG, or SVG.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-md font-bold text-slate-900 mb-4">Google Integrations</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics 4 Measurement ID</label>
                                <input
                                    type="text"
                                    placeholder="G-XXXXXXXXXX"
                                    value={formData.googleAnalyticsId}
                                    onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Google Tag Manager Container ID</label>
                                <input
                                    type="text"
                                    placeholder="GTM-XXXXXXX"
                                    value={formData.googleTagManagerId}
                                    onChange={(e) => setFormData({ ...formData, googleTagManagerId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Google Search Console Verification Token</label>
                                <input
                                    type="text"
                                    placeholder="Paste content value from google-site-verification meta tag"
                                    value={formData.googleSiteVerification}
                                    onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-md font-bold text-slate-900 mb-4">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                                <input
                                    type="text"
                                    placeholder="https://facebook.com/..."
                                    value={formData.socialUrls.facebook}
                                    onChange={(e) => setFormData({ ...formData, socialUrls: { ...formData.socialUrls, facebook: e.target.value } })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter (X) URL</label>
                                <input
                                    type="text"
                                    placeholder="https://twitter.com/..."
                                    value={formData.socialUrls.twitter}
                                    onChange={(e) => setFormData({ ...formData, socialUrls: { ...formData.socialUrls, twitter: e.target.value } })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                                <input
                                    type="text"
                                    placeholder="https://instagram.com/..."
                                    value={formData.socialUrls.instagram}
                                    onChange={(e) => setFormData({ ...formData, socialUrls: { ...formData.socialUrls, instagram: e.target.value } })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                                <input
                                    type="text"
                                    placeholder="https://linkedin.com/in/..."
                                    value={formData.socialUrls.linkedin}
                                    onChange={(e) => setFormData({ ...formData, socialUrls: { ...formData.socialUrls, linkedin: e.target.value } })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
