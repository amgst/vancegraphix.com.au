export interface Product {
    id: string;
    name: string;
    sku?: string;
    category: string;
    image: string;
    price: number;
    shortDescription: string;
    description: string;
    tags?: string[];
    status?: 'active' | 'archived';
    createdAt?: any;
}

