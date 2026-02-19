import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, Loader } from 'lucide-react';
import { getBlogPosts, BlogPost } from '../lib/blogService';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await getBlogPosts(true); // Fetch only published
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const blogStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Vance Graphix & Print (VGP) Blog',
        description: 'Insights, trends, and tips from the world of web design and development',
        url: 'https://vancegraphix.com.au/blog',
        publisher: {
            '@type': 'Organization',
            name: 'Vance Graphix & Print (VGP)'
        }
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <SEO
                title="Web Design & Dev Blog | Shopify Tips, Trends & Insights"
                description="Stay ahead with expert insights on E-commerce trends, Shopify tutorials, and web development best practices. Read our latest articles to grow your business."
                canonical="/blog"
                structuredData={blogStructuredData}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Insights for <span className="text-blue-600">Digital Growth</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Insights, trends, and tips from the world of web design and development.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="animate-spin text-blue-600" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {post.image && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}

                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(post.date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} />
                                            {post.author}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors">
                                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h2>

                                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                >
                                                    <Tag size={10} className="mr-1" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                                        >
                                            Read Article
                                            <ArrowRight
                                                size={16}
                                                className="ml-2 transform group-hover:translate-x-1 transition-transform"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                        {posts.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <p>No blog posts found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
