import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Tool, getIconByName } from '../../data/toolsData';
import { getTools, addTool, updateTool, deleteTool } from '../../lib/toolsService';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const AdminTools: React.FC = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTool, setCurrentTool] = useState<Partial<Tool>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchTools = async () => {
        setIsLoading(true);
        try {
            const fetchedTools = await getTools();
            setTools(fetchedTools);
        } catch (error) {
            console.error("Error fetching tools:", error);
            alert("Failed to fetch tools. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tool?')) {
            try {
                await deleteTool(id);
                await fetchTools(); // Refresh list
            } catch (error) {
                console.error("Error deleting tool:", error);
                alert("Failed to delete tool.");
            }
        }
    };

    const handleEdit = (tool: Tool) => {
        setCurrentTool(tool);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentTool({
            name: '',
            description: '',
            url: '',
            iconName: 'Wrench',
            category: 'Development'
        });
        setIsEditing(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentTool.name || !currentTool.url) return;

        try {
            if (currentTool.id) {
                // Update existing
                await updateTool(currentTool.id, currentTool);
            } else {
                // Add new
                await addTool(currentTool as Tool);
            }
            await fetchTools(); // Refresh list
            setIsEditing(false);
            setCurrentTool({});
        } catch (error) {
            console.error("Error saving tool:", error);
            alert("Failed to save tool.");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Tools</h1>
                    <p className="text-gray-500">Add or edit tools displayed on the public page.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Tool
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                {tools.find(t => t.id === currentTool.id) ? 'Edit Tool' : 'Add New Tool'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-slate-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentTool.name || ''}
                                    onChange={e => setCurrentTool({ ...currentTool, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={currentTool.description || ''}
                                    onChange={e => setCurrentTool({ ...currentTool, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input
                                    type="url"
                                    required
                                    value={currentTool.url || ''}
                                    onChange={e => setCurrentTool({ ...currentTool, url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={currentTool.category || 'Development'}
                                        onChange={e => setCurrentTool({ ...currentTool, category: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Development">Development</option>
                                        <option value="Design">Design</option>
                                        <option value="Productivity">Productivity</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                    <select
                                        value={currentTool.iconName || 'Wrench'}
                                        onChange={e => setCurrentTool({ ...currentTool, iconName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Wrench">Wrench</option>
                                        <option value="Code">Code</option>
                                        <option value="Palette">Palette</option>
                                        <option value="Zap">Zap</option>
                                        <option value="Globe">Globe</option>
                                        <option value="Database">Database</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Tool
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">URL</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tools.map((tool) => (
                            <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            {React.createElement(getIconByName(tool.iconName), { size: 16 })}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{tool.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{tool.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                        {tool.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate max-w-[150px] block">
                                        {tool.url}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(tool)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tool.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {tools.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No tools found. Click "Add New Tool" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminTools;
