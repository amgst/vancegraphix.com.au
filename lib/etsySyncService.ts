import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { Product } from '../data/productsData';
import EtsyService, { EtsyProduct, EtsyListing } from './etsyService';

// Extended product interface with Etsy fields
export interface ProductWithEtsySync extends Product {
  etsyListingId?: number;
  etsySku?: string;
  etsySyncStatus?: 'synced' | 'pending' | 'failed' | 'not-synced';
  lastEtsySyncTime?: any;
  syncError?: string;
  inventory?: number;
}

const SYNC_COLLECTION = 'product_etsy_sync';

class EtsySyncService {
  private etsyService: EtsyService;

  constructor(accessToken: string, shopId: string) {
    this.etsyService = new EtsyService({ accessToken, shopId });
  }

  /**
   * Create product on website AND Etsy (Full sync)
   */
  async createProductWithEtsySync(
    product: Omit<ProductWithEtsySync, 'id' | 'createdAt'>,
    uploadToEtsy: boolean = true
  ): Promise<ProductWithEtsySync> {
    try {
      // 1. Create on Firestore (website)
      const productsRef = collection(db, 'products');
      const newProductRef = doc(productsRef);

      const productData: ProductWithEtsySync = {
        ...product,
        id: newProductRef.id,
        createdAt: Timestamp.now(),
        etsySyncStatus: uploadToEtsy ? 'pending' : 'not-synced',
      };

      await setDoc(newProductRef, productData);

      // 2. Upload to Etsy if requested
      if (uploadToEtsy) {
        try {
          const etsyProduct: EtsyProduct = {
            title: product.name,
            description: product.description,
            price: product.price,
            quantity: product.inventory || 10,
            sku: product.sku || `SKU-${newProductRef.id}`,
            tags: product.tags || [],
            category_id: this.mapCategoryToEtsyTaxonomy(product.category),
          };

          const etsyListing = await this.etsyService.createListing(etsyProduct);

          // Update product with Etsy info
          await updateDoc(newProductRef, {
            etsyListingId: etsyListing.listing_id,
            etsySku: etsyListing.sku,
            etsySyncStatus: 'synced',
            lastEtsySyncTime: Timestamp.now(),
          });

          productData.etsyListingId = etsyListing.listing_id;
          productData.etsySyncStatus = 'synced';
        } catch (error: any) {
          // Mark sync as failed but keep product
          await updateDoc(newProductRef, {
            etsySyncStatus: 'failed',
            syncError: error.message,
          });
          productData.etsySyncStatus = 'failed';
          productData.syncError = error.message;
        }
      }

      return productData;
    } catch (error) {
      console.error('Error creating product with Etsy sync:', error);
      throw error;
    }
  }

  /**
   * Update product on website AND Etsy
   */
  async updateProductWithEtsySync(
    id: string,
    updates: Partial<ProductWithEtsySync>
  ): Promise<void> {
    try {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error('Product not found');
      }

      const product = productSnap.data() as ProductWithEtsySync;

      // Update on Firestore
      const updateData: any = { ...updates };
      updateData.lastModified = Timestamp.now();

      // Sync inventory to Etsy if changed
      if (updates.inventory !== undefined && product.etsyListingId) {
        try {
          await this.etsyService.updateInventory(
            product.etsyListingId,
            updates.inventory
          );
          updateData.etsySyncStatus = 'synced';
        } catch (error: any) {
          updateData.etsySyncStatus = 'failed';
          updateData.syncError = error.message;
        }
      }

      // Update listing on Etsy if name/price/description changed
      if (product.etsyListingId && 
          (updates.name || updates.price || updates.description)) {
        try {
          const etsyUpdates: any = {};
          if (updates.name) etsyUpdates.title = updates.name;
          if (updates.description) etsyUpdates.description = updates.description;
          if (updates.price) etsyUpdates.price = updates.price;

          await this.etsyService.updateListing(
            product.etsyListingId,
            etsyUpdates
          );
          updateData.etsySyncStatus = 'synced';
          updateData.lastEtsySyncTime = Timestamp.now();
        } catch (error: any) {
          updateData.etsySyncStatus = 'failed';
          updateData.syncError = error.message;
        }
      }

      await updateDoc(productRef, updateData);
    } catch (error) {
      console.error('Error updating product with Etsy sync:', error);
      throw error;
    }
  }

  /**
   * Sync product inventory in real-time (one-way: Firebase → Etsy)
   */
  async syncInventoryToEtsy(productId: string, quantity: number): Promise<void> {
    try {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error('Product not found');
      }

      const product = productSnap.data() as ProductWithEtsySync;

      if (!product.etsyListingId) {
        throw new Error('Product not synced to Etsy');
      }

      // Update Etsy
      await this.etsyService.updateInventory(product.etsyListingId, quantity);

      // Update Firebase
      await updateDoc(productRef, {
        inventory: quantity,
        etsySyncStatus: 'synced',
        lastEtsySyncTime: Timestamp.now(),
      });
    } catch (error: any) {
      console.error('Error syncing inventory:', error);
      throw error;
    }
  }

  /**
   * Deactivate product on Etsy (keep on website)
   */
  async deactivateOnEtsy(productId: string): Promise<void> {
    try {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error('Product not found');
      }

      const product = productSnap.data() as ProductWithEtsySync;

      if (!product.etsyListingId) {
        return;
      }

      await this.etsyService.deactivateListing(product.etsyListingId);

      await updateDoc(productRef, {
        etsySyncStatus: 'not-synced',
      });
    } catch (error) {
      console.error('Error deactivating on Etsy:', error);
      throw error;
    }
  }

  /**
   * Delete product from both Etsy AND website
   */
  async deleteProductFromBoth(productId: string): Promise<void> {
    try {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error('Product not found');
      }

      const product = productSnap.data() as ProductWithEtsySync;

      // Delete from Etsy
      if (product.etsyListingId) {
        await this.etsyService.deleteListing(product.etsyListingId);
      }

      // Delete from Firebase
      await updateDoc(productRef, { status: 'archived' });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Fetch Etsy orders and sync to Firebase
   */
  async syncEtsyOrdersToFirebase(): Promise<void> {
    try {
      const { orders } = await this.etsyService.getOrders({
        limit: 100,
        status: 'paid',
      });

      const ordersRef = collection(db, 'etsy_orders');

      for (const order of orders) {
        const orderDocRef = doc(ordersRef, order.order_id.toString());

        await setDoc(orderDocRef, {
          etsyOrderId: order.order_id,
          orderNumber: order.order_number,
          buyerId: order.buyer_user_id,
          totalPrice: order.total_price,
          status: order.status,
          createdAt: new Date(order.create_timestamp * 1000),
          items: order.transactions.map(t => ({
            listingId: t.listing_id,
            quantity: t.quantity,
            price: t.price,
          })),
          syncedAt: Timestamp.now(),
        });
      }

      console.log(`Synced ${orders.length} Etsy orders`);
    } catch (error) {
      console.error('Error syncing Etsy orders:', error);
      throw error;
    }
  }

  /**
   * Get all products with sync status
   */
  async getProductsWithSyncStatus(): Promise<ProductWithEtsySync[]> {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductWithEtsySync[];
    } catch (error) {
      console.error('Error fetching products with sync status:', error);
      throw error;
    }
  }

  /**
   * Retry failed syncs
   */
  async retryFailedSyncs(): Promise<void> {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('etsySyncStatus', '==', 'failed'));
      const snapshot = await getDocs(q);

      for (const productDoc of snapshot.docs) {
        const product = productDoc.data() as ProductWithEtsySync;
        console.log(`Retrying sync for product: ${product.name}`);

        try {
          await this.updateProductWithEtsySync(productDoc.id, {
            name: product.name,
            price: product.price,
          });
        } catch (error) {
          console.error(`Failed to retry product ${product.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error retrying failed syncs:', error);
      throw error;
    }
  }

  /**
   * Map category to Etsy taxonomy ID
   */
  private mapCategoryToEtsyTaxonomy(category: string): number {
    const categoryMap: Record<string, number> = {
      'Graphics': 1640000000,
      'Print': 1680000000,
      'Web Design': 1500000000,
      'Animation': 1740000000,
      'Default': 1,
    };
    return categoryMap[category] || categoryMap['Default'];
  }
}

export default EtsySyncService;
