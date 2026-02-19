import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../components/SEO';
import { getBlogPostBySlug, BlogPost as BlogPostType } from '../lib/blogService';

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (slug) {
                try {
                    const foundPost = await getBlogPostBySlug(slug);
                    if (foundPost) {
                        setPost(foundPost);
                    } else {
                        navigate('/blog');
                    }
                } catch (error) {
                    console.error("Error fetching blog post:", error);
                    navigate('/blog');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchPost();
    }, [slug, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!post) {
        return null;
    }

    const articleStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image || 'https://vancegraphix.com.au/wp-content/uploads/2021/02/logo-vgp.png',
        datePublished: post.date,
        dateModified: post.date,
        author: {
            '@type': 'Organization',
            name: post.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'Vance Graphix & Print (VGP)',
            logo: {
                '@type': 'ImageObject',
                url: 'https://vancegraphix.com.au/wp-content/uploads/2021/02/logo-vgp.png'
            }
        },
        keywords: post.tags.join(', ')
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <SEO
                title={post.title}
                description={post.excerpt}
                canonical={`/blog/${post.slug}`}
                image={post.image}
                type="article"
                publishedTime={post.date}
                author={post.author}
                tags={post.tags}
                structuredData={articleStructuredData}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                <article className="bg-white">
                    <header className="mb-12">
                        {post.image && (
                            <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl h-64 md:h-[500px] w-full relative">
                                <img
                                    src={post.image}
                                    alt={post.imageAlt || post.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
                            <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                                <Calendar size={16} />
                                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-full font-medium">
                                <User size={16} />
                                {post.author}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {Math.ceil(post.content.split(' ').length / 200)} min read
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light italic border-l-4 border-blue-500 pl-6">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-10">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                                >
                                    <Tag size={12} className="mr-1.5" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    <div className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
                        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4
                        prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-slate-800
                        prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-slate-800
                        prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-6
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                        prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-ul:my-6 prose-ul:space-y-2
                        prose-ol:my-6 prose-ol:space-y-2
                        prose-li:text-gray-700 prose-li:leading-relaxed
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-700 prose-blockquote:italic
                        prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                        prose-pre:bg-slate-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-lg
                        prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-8 prose-img:w-full
                        prose-hr:my-12 prose-hr:border-gray-200
                        prose-table:w-full prose-table:my-8 prose-table:border-collapse
                        prose-th:bg-gray-50 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900
                        prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-slate-900 mb-6 mt-12 pb-4 border-b border-gray-200" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-slate-800 mb-4 mt-10" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-slate-800 mb-3 mt-8" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-xl font-bold text-slate-800 mb-2 mt-6" {...props} />,
                                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props} />,
                                ul: ({node, ...props}) => <ul className="my-6 space-y-3 list-disc list-inside" {...props} />,
                                ol: ({node, ...props}) => <ol className="my-6 space-y-3 list-decimal list-inside" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-700 leading-relaxed ml-4" {...props} />,
                                blockquote: ({node, ...props}) => (
                                    <blockquote className="border-l-4 border-blue-500 bg-blue-50 py-4 px-6 my-8 rounded-r-lg text-gray-700 italic" {...props} />
                                ),
                                code: ({node, inline, className, children, ...props}: any) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return inline ? (
                                        <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre className="bg-slate-900 text-gray-100 rounded-xl p-6 overflow-x-auto shadow-lg my-8">
                                            <code className="text-sm font-mono" {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    );
                                },
                                img: ({node, ...props}: any) => (
                                    <img className="rounded-2xl shadow-xl my-8 w-full" {...props} />
                                ),
                                a: ({node, ...props}: any) => (
                                    <a className="text-blue-600 font-semibold hover:text-blue-700 no-underline hover:underline" {...props} />
                                ),
                                strong: ({node, ...props}) => <strong className="text-slate-900 font-bold" {...props} />,
                                hr: ({node, ...props}) => <hr className="my-12 border-gray-200" {...props} />,
                                table: ({node, ...props}: any) => (
                                    <div className="overflow-x-auto my-8">
                                        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden" {...props} />
                                    </div>
                                ),
                                thead: ({node, ...props}: any) => <thead className="bg-gray-50" {...props} />,
                                tbody: ({node, ...props}: any) => <tbody {...props} />,
                                tr: ({node, ...props}: any) => <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors" {...props} />,
                                th: ({node, ...props}: any) => (
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-slate-900 bg-gray-50" {...props} />
                                ),
                                td: ({node, ...props}: any) => (
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700" {...props} />
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Author & Share Section */}
                    <div className="mt-16 pt-12 border-t-2 border-gray-200">
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">About the Author</h3>
                                    <p className="text-gray-600">{post.author}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Share this article</h3>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: post.title,
                                                        text: post.excerpt,
                                                        url: window.location.href
                                                    });
                                                } else {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    alert('Link copied to clipboard!');
                                                }
                                            }}
                                            className="p-3 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
                                            title="Share"
                                        >
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Posts / CTA */}
                        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                                Let's bring your vision to life. Get in touch with us today for a free consultation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/contact"
                                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    to="/services"
                                    className="px-8 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/20"
                                >
                                    View Services
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
