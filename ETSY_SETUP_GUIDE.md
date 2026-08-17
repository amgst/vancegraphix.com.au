# ETSY API CONFIGURATION GUIDE
# ==========================

## Step 1: Get Etsy API Credentials

1. Go to https://www.etsy.com/developers
2. Sign in with your Etsy account
3. Click "Create an App"
4. Fill in the required information:
   - App name: Your business name (e.g., "Vance Graphix Store")
   - App description: "Syncing products between website and Etsy"
   - Keychain phrase: Create a secure phrase
5. Accept terms and create
6. You'll get:
   - **App ID** (also called API Key)
   - **API Secret**
   - **API Key Token** (for accessing shop data)

## Step 2: Get Your Shop ID

1. Go to your Etsy Shop Settings
2. Find your Shop ID in the URL or shop settings
3. It's a 7-9 digit number

## Step 3: Generate OAuth Access Token

Since the app requires user authentication, you'll need to implement OAuth flow:

1. Use Etsy's OAuth authorization endpoint
2. Redirect users to get permission
3. Exchange authorization code for access token
4. Store the access token securely (preferably in a backend)

For testing/development, Etsy provides a temporary token in your App Settings.

## Step 4: Add to Your Environment

Create a `.env.local` file in your project root with:

```
VITE_ETSY_API_KEY=your_app_id_here
VITE_ETSY_API_SECRET=your_api_secret_here
VITE_ETSY_SHOP_ID=your_shop_id_here
# Store this securely - preferably in a backend service
VITE_ETSY_ACCESS_TOKEN=your_oauth_access_token_here
```

## Step 5: Initialize in Your App

In your admin dashboard or settings page, add:

```typescript
import EtsySyncService from './lib/etsySyncService';

// Initialize the service (get accessToken from secure backend)
const etsySync = new EtsySyncService(
  process.env.VITE_ETSY_ACCESS_TOKEN || '',
  process.env.VITE_ETSY_SHOP_ID || ''
);

// Then use it to sync products
await etsySync.createProductWithEtsySync(productData, true);
```

## Step 6: Supported Features

✅ Create products on both website and Etsy
✅ Update inventory in real-time
✅ Sync product details (name, description, price)
✅ Deactivate Etsy listings
✅ Fetch Etsy orders and sync to Firebase
✅ Retry failed syncs

## Step 7: Etsy API Endpoints Used

- `POST /shops/{shop_id}/listings` - Create listing
- `PUT /shops/{shop_id}/listings/{listing_id}` - Update listing
- `PUT /shops/{shop_id}/listings/{listing_id}/inventory` - Update inventory
- `POST /shops/{shop_id}/listings/{listing_id}/images` - Upload images
- `GET /shops/{shop_id}/listings` - Get all listings
- `GET /shops/{shop_id}/orders` - Get orders
- `DELETE /shops/{shop_id}/listings/{listing_id}` - Delete listing

## Troubleshooting

### "Unauthorized" errors
- Check your access token expiration
- Verify your Shop ID is correct
- Ensure the API key matches your app

### Image upload fails
- Make sure images are JPG/PNG format
- Images must be under 20MB
- Use proper image URLs

### Inventory sync doesn't work
- Product must have at least one offering
- Quantity cannot be negative
- Max quantity is 9999

## Next Steps

1. Set up Firebase Firestore rules for secure data access
2. Implement backend API for secure token storage
3. Add Etsy Settings page in your admin dashboard
4. Set up automated daily sync of orders
5. Create webhook handlers for Etsy events
