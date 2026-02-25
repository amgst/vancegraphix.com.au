import { Product } from './productsData';

export const PRODUCTS_SEED_DATA: Omit<Product, 'id' | 'createdAt'>[] = [
    {
        name: 'Custom Premium T-Shirt',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
        price: 29.99,
        shortDescription: 'High-quality cotton t-shirt with custom print.',
        description: 'Our premium t-shirts are made from 100% combed and ring-spun cotton. They are comfortable, soft, and perfect for custom designs that last.',
        status: 'active',
        tags: ['apparel', 'custom', 't-shirt']
    },
    {
        name: 'Classic Pullover Hoodie',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
        price: 49.99,
        shortDescription: 'Warm and cozy hoodie for everyday wear.',
        description: 'This classic hoodie features a front pouch pocket and matching drawstrings. Made from a soft cotton-poly blend, it’s perfect for chilly days.',
        status: 'active',
        tags: ['apparel', 'hoodie', 'winter']
    },
    {
        name: 'Ceramic Coffee Mug (11oz)',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop',
        price: 15.99,
        shortDescription: 'Durable ceramic mug for your favorite beverages.',
        description: 'Start your day with a custom mug. Our 11oz ceramic mugs are microwave and dishwasher safe, featuring high-quality sublimation printing.',
        status: 'active',
        tags: ['home', 'mug', 'gift']
    },
    {
        name: 'Framed Matte Paper Poster',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1000&auto=format&fit=crop',
        price: 34.99,
        shortDescription: 'Professional quality wall art for your home or office.',
        description: 'Museum-quality posters made on thick and durable matte paper. Each poster is giclée-printed on archival, acid-free paper that yields brilliant prints.',
        status: 'active',
        tags: ['decor', 'poster', 'art']
    },
    {
        name: 'Embroidered Snapback Hat',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
        price: 24.99,
        shortDescription: 'Stylish snapback with custom embroidery.',
        description: 'A classic snapback cap with a high-profile fit and a green under-visor. Perfect for custom embroidery designs.',
        status: 'active',
        tags: ['apparel', 'hat', 'accessories']
    },
    {
        name: 'Canvas Tote Bag',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1544816153-12ad582224c6?q=80&w=1000&auto=format&fit=crop',
        price: 19.99,
        shortDescription: 'Eco-friendly tote bag for shopping and more.',
        description: 'Durable 100% cotton canvas tote bag. Large enough to hold your essentials while being environmentally friendly.',
        status: 'active',
        tags: ['accessories', 'eco-friendly', 'bag']
    },
    {
        name: 'Stainless Steel Water Bottle',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1602143399827-7218ca0519a2?q=80&w=1000&auto=format&fit=crop',
        price: 27.99,
        shortDescription: 'Insulated bottle to keep your drinks at the right temperature.',
        description: 'Double-walled stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.',
        status: 'active',
        tags: ['accessories', 'fitness', 'bottle']
    },
    {
        name: 'Eco-Friendly Cotton Tee',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
        price: 32.99,
        shortDescription: 'Organic cotton t-shirt for sustainable style.',
        description: 'Made from 100% organic cotton, this t-shirt is soft on your skin and kind to the planet. Sustainable fashion at its best.',
        status: 'active',
        tags: ['apparel', 'eco-friendly', 't-shirt']
    },
    {
        name: 'Personalized Phone Case',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1586105251261-72a756657311?q=80&w=1000&auto=format&fit=crop',
        price: 22.99,
        shortDescription: 'Protective and stylish case for your smartphone.',
        description: 'Slim yet durable phone case that protects your device from scratches and minor drops while showing off your unique style.',
        status: 'active',
        tags: ['accessories', 'phone', 'custom']
    },
    {
        name: 'Premium Spiral Notebook',
        category: 'Print on Demand',
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format&fit=crop',
        price: 14.99,
        shortDescription: 'High-quality notebook for all your ideas.',
        description: 'A premium spiral-bound notebook with 120 pages of ruled paper. Durable cover and perfect size for carrying everywhere.',
        status: 'active',
        tags: ['office', 'stationery', 'gift']
    }
];
