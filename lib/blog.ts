export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    tags: string[];
    image?: string;
    imageAlt?: string;
}

const parseFrontmatter = (fileContent: string) => {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(fileContent);

    if (!match) {
        return { data: {}, content: fileContent };
    }

    const frontmatterBlock = match[1];
    const content = fileContent.replace(match[0], '').trim();

    const data: Record<string, any> = {};
    frontmatterBlock.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            let value = valueParts.join(':').trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            // Handle arrays (simple comma-separated)
            if (value.startsWith('[') && value.endsWith(']')) {
                data[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
            } else {
                data[key.trim()] = value;
            }
        }
    });

    return { data, content };
};

export const getBlogPosts = (): BlogPost[] => {
    const modules = import.meta.glob('/content/blog/*.md', { as: 'raw', eager: true });

    const posts: BlogPost[] = Object.keys(modules).map((path) => {
        const content = modules[path] as string;
        const { data, content: markdownContent } = parseFrontmatter(content);

        return {
            id: data.slug,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: markdownContent,
            date: data.date,
            author: data.author,
            tags: data.tags || [],
            image: data.image,
            imageAlt: data.imageAlt,
        };
    });

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
    const posts = getBlogPosts();
    return posts.find((post) => post.slug === slug);
};
