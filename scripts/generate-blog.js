import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

const DATA_FILE = path.join(__dirname, "../data/blog-posts.json");

async function generateBlogPost() {
    try {
        console.log("Generating blog post...");

        const prompt = `
      Write a comprehensive, long-form blog post (at least 1500 words) about a trending topic in web design, development, or digital marketing.
      The output must be a valid JSON object with the following fields:
      - title: A catchy, SEO-optimized title.
      - slug: A URL-friendly slug based on the title.
      - excerpt: A compelling summary (2-3 sentences).
      - content: The full blog post content in Markdown format. 
        - Use ## and ### for clear heading hierarchy.
        - Include bullet points, numbered lists, and blockquotes where appropriate.
        - CRITICAL: Embed 3-5 relevant images directly in the markdown content using this format: ![Alt Text](https://source.unsplash.com/featured/?KEYWORD). Replace KEYWORD with a single specific word relevant to the section (e.g., "coding", "meeting", "sketchbook").
      - tags: An array of 5-8 relevant tags.
      - image_keyword: A single English keyword relevant to the main topic for the featured image.
      
      Do not include markdown code blocks (like \`\`\`json) in the response, just the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up potential markdown code blocks if the model adds them despite instructions
        text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

        const newPost = JSON.parse(text);

        // Add metadata
        newPost.id = Date.now().toString();
        newPost.date = new Date().toISOString().split("T")[0];
        newPost.author = "PixelPro AI";
        // Use Unsplash source for random image based on keyword
        newPost.image = `https://source.unsplash.com/featured/?${newPost.image_keyword || 'technology'}`;

        // Read existing posts
        let posts = [];
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
            posts = JSON.parse(fileContent);
        }

        // Prepend new post
        posts.unshift(newPost);

        // Save back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));

        console.log(`Successfully generated and saved: "${newPost.title}"`);

    } catch (error) {
        console.error("Error generating blog post:", error);
    }
}

generateBlogPost();
