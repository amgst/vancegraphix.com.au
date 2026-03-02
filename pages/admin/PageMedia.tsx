import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getPageMedia, setPageMedia } from '../../lib/pageMediaService';
import { resolveImageUrl } from '../../lib/imageUrl';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';

type MediaKey = {
  key: string;
  label: string;
  hint?: string;
};

const DESIGN_PROCESS_KEYS: MediaKey[] = [
  { key: 'introRightImage', label: 'Intro Right Image' },
  { key: 'commencingImage', label: 'Project Commencing Image' },
  { key: 'processDiagramImage', label: 'Process Diagram Image' },
  { key: 'researchImage', label: 'Research / Brainstorming Image' },
  { key: 'developmentImage', label: 'Development Process Image' },
  { key: 'presentationImage', label: 'Presentation / Modification Image' },
  { key: 'productionImage', label: 'Production / Launch Image' },
  { key: 'completionImage', label: 'Completion / Commitment Image' },
];

const PAGE_OPTIONS = [
  { id: 'design_process', name: 'Design Process' },
] as const;

const AdminPageMedia: React.FC = () => {
  const [pageId, setPageId] = useState<typeof PAGE_OPTIONS[number]['id']>('design_process');
  const [media, setMedia] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const keysForPage: MediaKey[] = (() => {
    switch (pageId) {
      case 'design_process':
      default:
        return DESIGN_PROCESS_KEYS;
    }
  })();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPageMedia(pageId);
      setMedia(data || {});
    } catch (e) {
      console.error('Failed to load page media', e);
      setMedia({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [pageId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setPageMedia(pageId, media);
      alert('Page media saved');
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Page Media</h1>
        <p className="text-gray-500">Manage image file names used on public pages.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Select Page</label>
          <select
            value={pageId}
            onChange={(e) => setPageId(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {PAGE_OPTIONS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-slate-900" size={28} />
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {keysForPage.map(({ key, label, hint }) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
                <div className="flex items-start gap-4">
                  <div className="w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative">
                    {media[key] ? (
                      <img src={resolveImageUrl(media[key])} alt={label} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
                    <input
                      type="text"
                      value={media[key] || ''}
                      onChange={(e) => setMedia(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Image file name (e.g. pizza.jpg)"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter only the file name. It will be resolved with `VITE_GITHUB_IMAGE_BASE_URL`.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Media
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPageMedia;
