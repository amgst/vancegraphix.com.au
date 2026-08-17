import axios from 'axios';

/**
 * Backend API Gateway for Etsy Integration
 * 
 * This file demonstrates how to create a secure backend that handles
 * Etsy API calls without exposing credentials to the frontend.
 * 
 * RECOMMENDED: Implement this on your backend (Vercel Functions, Firebase Functions, Node.js server)
 */

// Example: Vercel Function (api/etsy/sync-product.ts)
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, productId, productData, quantity } = req.body;

  try {
    // Verify user is authenticated
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get access token from secure storage (e.g., database or secrets manager)
    const accessToken = process.env.ETSY_ACCESS_TOKEN;
    const shopId = process.env.ETSY_SHOP_ID;

    const etsyHeaders = {
      'x-api-key': process.env.ETSY_API_KEY,
      'Authorization': `Bearer ${accessToken}`,
    };

    switch (action) {
      case 'create_listing':
        return await createListing(productData, etsyHeaders, shopId, res);

      case 'update_listing':
        return await updateListing(productId, productData, etsyHeaders, shopId, res);

      case 'sync_inventory':
        return await syncInventory(productId, quantity, etsyHeaders, shopId, res);

      case 'get_orders':
        return await getOrders(etsyHeaders, shopId, res);

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Etsy API error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function createListing(productData: any, headers: any, shopId: string, res: any) {
  try {
    const payload = {
      title: productData.name,
      description: productData.description,
      price: Math.round(productData.price * 100),
      quantity: productData.inventory || 10,
      sku: productData.sku || `SKU-${Date.now()}`,
      tags: productData.tags?.slice(0, 13) || [],
      taxonomy_id: 1,
    };

    const response = await axios.post(
      `https://openapi.etsy.com/v3/shops/${shopId}/listings`,
      payload,
      { headers }
    );

    res.status(200).json({
      success: true,
      etsyListingId: response.data.listing_id,
      message: 'Product created on Etsy successfully',
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
}

async function updateListing(
  listingId: string,
  updates: any,
  headers: any,
  shopId: string,
  res: any
) {
  try {
    const payload: any = {};

    if (updates.name) payload.title = updates.name;
    if (updates.description) payload.description = updates.description;
    if (updates.price) payload.price = Math.round(updates.price * 100);
    if (updates.tags) payload.tags = updates.tags.slice(0, 13);

    const response = await axios.put(
      `https://openapi.etsy.com/v3/shops/${shopId}/listings/${listingId}`,
      payload,
      { headers }
    );

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
}

async function syncInventory(
  listingId: string,
  quantity: number,
  headers: any,
  shopId: string,
  res: any
) {
  try {
    // Get current inventory
    const getResponse = await axios.get(
      `https://openapi.etsy.com/v3/shops/${shopId}/listings/${listingId}/inventory`,
      { headers }
    );

    const inventory = getResponse.data;
    if (!inventory.products?.[0]) {
      return res.status(400).json({ error: 'No inventory to update' });
    }

    // Update inventory
    const updatePayload = {
      products: [
        {
          product_id: inventory.products[0].product_id,
          offerings: [
            {
              offering_id: inventory.products[0].offerings[0]?.offering_id,
              quantity: quantity,
            },
          ],
        },
      ],
    };

    await axios.put(
      `https://openapi.etsy.com/v3/shops/${shopId}/listings/${listingId}/inventory`,
      updatePayload,
      { headers }
    );

    res.status(200).json({
      success: true,
      message: `Inventory updated to ${quantity} units`,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
}

async function getOrders(headers: any, shopId: string, res: any) {
  try {
    const response = await axios.get(
      `https://openapi.etsy.com/v3/shops/${shopId}/orders?status=paid&limit=100`,
      { headers }
    );

    res.status(200).json({
      success: true,
      orders: response.data.results || [],
      count: response.data.count || 0,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
}
