import React, { useState, useEffect } from 'react';
import {
    getBlogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    BlogPost
} from '../../lib/blogService';
import { BLOG_POSTS_SEED_DATA } from '../../data/blogPostsSeed';
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Download } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminBlog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const data = await getBlogPosts(false); // Fetch all, including drafts
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            alert("Failed to fetch posts.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPost.title || !currentPost.slug || !currentPost.content) {
            alert("Title, Slug, and Content are required.");
            return;
        }

        try {
            const postData = {
                ...currentPost,
                tags: typeof currentPost.tags === 'string'
                    ? (currentPost.tags as string).split(',').map((t: string) => t.trim())
                    : currentPost.tags || [],
                date: currentPost.date || new Date().toISOString().split('T')[0],
                published: currentPost.published ?? false
            };

            if (currentPost.id) {
                await updateBlogPost(currentPost.id, postData);
            } else {
                await addBlogPost(postData as Omit<BlogPost, 'id'>);
            }
            await fetchPosts();
            setIsEditing(false);
            setCurrentPost({});
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Failed to save post.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await deleteBlogPost(id);
            await fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post.");
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleImportPosts = async () => {
        if (!window.confirm('This will import 3 service-related blog posts. Continue?')) {
            return;
        }

        setIsImporting(true);
        try {
            const existingPosts = await getBlogPosts(false); // Get all posts including drafts
            const existingSlugs = new Set(existingPosts.map(p => p.slug.toLowerCase()));

            let imported = 0;
            let skipped = 0;

            for (const post of BLOG_POSTS_SEED_DATA) {
                // Check if post already exists by slug
                if (existingSlugs.has(post.slug.toLowerCase())) {
                    skipped++;
                    continue;
                }

                await addBlogPost(post);
                imported++;
            }

            await fetchPosts(); // Refresh list
            alert(`Import complete! ${imported} posts imported, ${skipped} skipped (already exist).`);
        } catch (error) {
            console.error("Error importing blog posts:", error);
            alert("Failed to import blog posts. Check console for details.");
        } finally {
            setIsImporting(false);
        }
    };

    const handlePublishAll = async () => {
        const draftPosts = posts.filter(p => !p.published);
        if (draftPosts.length === 0) {
            alert('No draft posts to publish.');
            return;
        }

        if (!window.confirm(`Publish ${draftPosts.length} draft post(s)?`)) {
            return;
        }

        try {
            for (const post of draftPosts) {
                await updateBlogPost(post.id, { published: true });
            }
            await fetchPosts();
            alert(`Successfully published ${draftPosts.length} post(s)!`);
        } catch (error) {
            console.error("Error publishing posts:", error);
            alert("Failed to publish posts.");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={handleImportPosts}
                            disabled={isImporting}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={20} /> {isImporting ? 'Importing...' : 'Import Service Posts'}
                        </button>
                        {posts.some(p => !p.published) && (
                            <button
                                onClick={handlePublishAll}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
                            >
                                <Eye size={20} /> Publish All Drafts
                            </button>
                        )}
                        <button
                            onClick={() => { setCurrentPost({ published: false, author: 'Admin', date: new Date().toISOString().split('T')[0] }); setIsEditing(true); }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Plus size={20} /> New Post
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                            <div className="text-sm text-gray-500">{post.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await updateBlogPost(post.id, { published: !post.published });
                                                            await fetchPosts();
                                                        } catch (error) {
                                                            console.error("Error toggling publish status:", error);
                                                            alert("Failed to update publish status.");
                                                        }
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        post.published
                                                            ? 'text-green-600 hover:bg-green-50'
                                                            : 'text-yellow-600 hover:bg-yellow-50'
                                                    }`}
                                                    title={post.published ? 'Unpublish' : 'Publish'}
                                                >
                                                    {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => { setCurrentPost(post); setIsEditing(true); }}
                                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No posts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white p-6 rounded-lg w-full max-w-4xl my-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{currentPost.id ? 'Edit Post' : 'New Post'}</h2>
                                <button onClick={() => setIsEditing(false)}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={currentPost.title || ''}
                                            onChange={e => {
                                                const title = e.target.value;
                                                setCurrentPost(prev => ({
                                                    ...prev,
                                                    title,
                                                    slug: !prev.id ? generateSlug(title) : prev.slug
                                                }));
                                            }}
                                            className="w-full border p-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={currentPost.slug || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                            className="w-full border p-2 rounded"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={currentPost.date || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, date: e.target.value })}
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Author</label>
                                        <input
                                            type="text"
                                            value={currentPost.author || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, author: e.target.value })}
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={currentPost.published || false}
                                                onChange={e => setCurrentPost({ ...currentPost, published: e.target.checked })}
                                                className="mr-2 h-4 w-4"
                                            />
                                            <span className="text-sm font-medium">Published</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                                    <textarea
                                        value={currentPost.excerpt || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                        className="w-full border p-2 rounded"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
                                    <textarea
                                        value={currentPost.content || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                                        className="w-full border p-2 rounded font-mono text-sm"
                                        rows={15}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={currentPost.image || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, image: e.target.value })}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={Array.isArray(currentPost.tags) ? currentPost.tags.join(', ') : currentPost.tags || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, tags: e.target.value })}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border rounded hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Save Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminBlog;
