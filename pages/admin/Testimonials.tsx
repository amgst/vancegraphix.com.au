import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Testimonial, getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '../../lib/testimonialsService';
import { Plus, Trash2, Edit2, Save, X, Loader2, Search, Star, MessageSquare } from 'lucide-react';

const StarRatingPicker: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className={`text-2xl transition-colors ${star <= value ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'}`}
            >
                ★
            </button>
        ))}
    </div>
);

const AdminTestimonials: React.FC = () => {
    const [items, setItems] = React.useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const emptyForm = (): Partial<Testimonial> => ({
        name: '',
        role: '',
        company: '',
        image: '',
        content: '',
        rating: 5,
        order: 0,
    });

    const [form, setForm] = React.useState<Partial<Testimonial>>(emptyForm());

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            setItems(await getTestimonials());
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            alert('Failed to fetch testimonials.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => { fetchItems(); }, []);

    // Filter + Pagination
    const filtered = items.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAddNew = () => {
        setForm(emptyForm());
        setIsEditing(true);
    };

    const handleEdit = (item: Testimonial) => {
        setForm(item);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this testimonial?')) return;
        try {
            await deleteTestimonial(id);
            await fetchItems();
        } catch (err) {
            console.error(err);
            alert('Failed to delete.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.content) {
            alert('Name and content are required.');
            return;
        }
        setIsSaving(true);
        try {
            if (form.id) {
                await updateTestimonial(form.id, form);
            } else {
                await addTestimonial(form as Omit<Testimonial, 'id'>);
            }
            await fetchItems();
            setIsEditing(false);
            setForm(emptyForm());
        } catch (err) {
            console.error(err);
            alert('Failed to save.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
                        <p className="text-gray-500">Manage "Trusted by Australian Businesses" reviews.</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Testimonial
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, company or review..."
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    />
                </div>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={36} className="animate-spin text-blue-600" />
                </div>
            ) : (
                <>
                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentItems.map(item => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow relative group">
                                {/* Stars */}
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
                                    ))}
                                </div>

                                {/* Quote icon */}
                                <MessageSquare size={20} className="absolute top-5 right-5 text-blue-100" />

                                {/* Content */}
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                                    "{item.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                            {item.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{item.role}{item.company ? `, ${item.company}` : ''}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Order badge */}
                                {item.order !== undefined && (
                                    <span className="absolute top-3 left-3 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                                        #{item.order}
                                    </span>
                                )}
                            </div>
                        ))}

                        {currentItems.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                                <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No testimonials yet. Add your first one!</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <button
                                    key={n}
                                    onClick={() => setCurrentPage(n)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === n ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add / Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                {form.id ? 'Edit Testimonial' : 'Add Testimonial'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-slate-900">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client / Business Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name || ''}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>

                            {/* Role + Company */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
                                    <input
                                        type="text"
                                        value={form.role || ''}
                                        onChange={e => setForm({ ...form, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Business Owner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location / Company</label>
                                    <input
                                        type="text"
                                        value={form.company || ''}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Sydney"
                                    />
                                </div>
                            </div>

                            {/* Avatar URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                                <input
                                    type="url"
                                    value={form.image || ''}
                                    onChange={e => setForm({ ...form, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://..."
                                />
                                {form.image && (
                                    <img src={form.image} alt="Preview" className="mt-2 w-12 h-12 rounded-full object-cover border border-gray-200" />
                                )}
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
                                <StarRatingPicker value={form.rating ?? 5} onChange={v => setForm({ ...form, rating: v })} />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Review / Testimonial *</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={form.content || ''}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="What did the client say..."
                                />
                            </div>

                            {/* Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={form.order ?? 0}
                                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) })}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Lower number = shown first</p>
                            </div>

                            {/* Buttons */}
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
                                    disabled={isSaving}
                                    className={`px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminTestimonials;
