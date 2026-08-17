import axios, { AxiosInstance } from 'axios';

// Etsy API Configuration
const ETSY_BASE_URL = 'https://openapi.etsy.com/v3';

export interface EtsyProduct {
  id?: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  sku?: string;
  category_id: number;
  tags: string[];
  images?: string[]; // Image URLs to upload
  shipping_template_id?: number;
  taxonomy_id?: number;
}

export interface EtsyListing {
  listing_id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  tags: string[];
  state: 'active' | 'inactive' | 'draft';
  creation_timestamp: number;
}

export interface EtsyOrder {
  order_id: number;
  order_number: string;
  buyer_user_id: number;
  total_price: number;
  status: string;
  create_timestamp: number;
  transactions: EtsyTransaction[];
}

export interface EtsyTransaction {
  transaction_id: number;
  listing_id: number;
  quantity: number;
  price: number;
}

interface EtsyConfig {
  accessToken: string;
  shopId: string;
}

class EtsyService {
  private client: AxiosInstance;
  private shopId: string;

  constructor(config: EtsyConfig) {
    this.shopId = config.shopId;
    this.client = axios.create({
      baseURL: ETSY_BASE_URL,
      headers: {
        'x-api-key': process.env.VITE_ETSY_API_KEY || '',
        'Authorization': `Bearer ${config.accessToken}`,
      },
      timeout: 10000,
    });
  }

  /**
   * Create a new listing on Etsy
   */
  async createListing(product: EtsyProduct): Promise<EtsyListing> {
    try {
      const payload = {
        title: product.title,
        description: product.description,
        price: Math.round(product.price * 100), // Convert to cents
        quantity: product.quantity,
        sku: product.sku || `SKU-${Date.now()}`,
        tags: product.tags.slice(0, 13), // Etsy max 13 tags
        shipping_template_id: product.shipping_template_id,
        taxonomy_id: product.taxonomy_id || 1, // Default taxonomy
      };

      const response = await this.client.post(
        `/shops/${this.shopId}/listings`,
        payload
      );

      // Upload images if provided
      if (product.images && product.images.length > 0) {
        await this.uploadListingImages(response.data.listing_id, product.images);
      }

      return response.data;
    } catch (error) {
      console.error('Error creating Etsy listing:', error);
      throw error;
    }
  }

  /**
   * Update existing listing on Etsy
   */
  async updateListing(listingId: number, updates: Partial<EtsyProduct>): Promise<EtsyListing> {
    try {
      const payload: Record<string, any> = {};

      if (updates.title) payload.title = updates.title;
      if (updates.description) payload.description = updates.description;
      if (updates.price) payload.price = Math.round(updates.price * 100);
      if (updates.quantity !== undefined) payload.quantity = updates.quantity;
      if (updates.tags) payload.tags = updates.tags.slice(0, 13);

      const response = await this.client.put(
        `/shops/${this.shopId}/listings/${listingId}`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error('Error updating Etsy listing:', error);
      throw error;
    }
  }

  /**
   * Get listing details from Etsy
   */
  async getListing(listingId: number): Promise<EtsyListing> {
    try {
      const response = await this.client.get(`/listings/${listingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Etsy listing:', error);
      throw error;
    }
  }

  /**
   * Get all shop listings
   */
  async getShopListings(params?: {
    limit?: number;
    offset?: number;
    state?: 'active' | 'inactive' | 'draft';
  }): Promise<{ listings: EtsyListing[]; count: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.state) queryParams.append('state', params.state);

      const response = await this.client.get(
        `/shops/${this.shopId}/listings?${queryParams.toString()}`
      );

      return {
        listings: response.data.results || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error('Error fetching shop listings:', error);
      throw error;
    }
  }

  /**
   * Update inventory for listing
   */
  async updateInventory(listingId: number, quantity: number): Promise<void> {
    try {
      // Get listing inventory
      const response = await this.client.get(
        `/shops/${this.shopId}/listings/${listingId}/inventory`
      );

      const inventoryData = response.data;
      if (inventoryData.products && inventoryData.products.length > 0) {
        // Update first product offering
        const product = inventoryData.products[0];
        await this.client.put(
          `/shops/${this.shopId}/listings/${listingId}/inventory`,
          {
            products: [
              {
                product_id: product.product_id,
                offerings: [
                  {
                    offering_id: product.offerings[0]?.offering_id,
                    quantity: quantity,
                  },
                ],
              },
            ],
          }
        );
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  }

  /**
   * Upload images to listing
   */
  async uploadListingImages(listingId: number, imageUrls: string[]): Promise<void> {
    try {
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        // You need to fetch the image and convert to file
        const imageBuffer = await this.fetchImageAsBuffer(imageUrl);

        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        formData.append('image', blob);

        await this.client.post(
          `/shops/${this.shopId}/listings/${listingId}/images`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  /**
   * Get orders from Etsy
   */
  async getOrders(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{ orders: EtsyOrder[]; count: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.status) queryParams.append('status', params.status);

      const response = await this.client.get(
        `/shops/${this.shopId}/orders?${queryParams.toString()}`
      );

      return {
        orders: response.data.results || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Deactivate listing
   */
  async deactivateListing(listingId: number): Promise<void> {
    try {
      await this.client.put(
        `/shops/${this.shopId}/listings/${listingId}`,
        { state: 'inactive' }
      );
    } catch (error) {
      console.error('Error deactivating listing:', error);
      throw error;
    }
  }

  /**
   * Delete listing
   */
  async deleteListing(listingId: number): Promise<void> {
    try {
      await this.client.delete(
        `/shops/${this.shopId}/listings/${listingId}`
      );
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  /**
   * Helper: Fetch image as buffer
   */
  private async fetchImageAsBuffer(imageUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  }
}

export default EtsyService;
