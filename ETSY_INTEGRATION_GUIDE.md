# Etsy Integration Guide - Complete Setup

## Overview

اب آپ اپنی website اور Etsy shop دونوں پر products sync کر سکتے ہیں۔ یہ system:

✅ **Products sync** - Website اور Etsy دونوں par products create/update  
✅ **Inventory sync** - Real-time inventory updates  
✅ **Orders sync** - Etsy orders اپنی database میں store  
✅ **Error handling** - Failed syncs automatically retry  

---

## Architecture

```
┌─────────────────┐
│   Vance Graphix │
│    Website      │
└────────┬────────┘
         │
         │ Product Data
         ▼
┌─────────────────┐
│  Firebase/Firestore
│  (Central Database)
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌───────┐  ┌──────────┐
│Website│  │Etsy Shop │
│Store  │  │(API Sync)│
└───────┘  └──────────┘
```

**Two Way Sync:**
- **Website → Etsy**: Products create/update automatically
- **Etsy → Website**: Orders pull from Etsy for analytics

---

## File Structure

```
lib/
  ├── etsyService.ts          # Core Etsy API wrapper
  └── etsySyncService.ts      # Sync logic (Firebase + Etsy)

pages/admin/
  └── StoreWithEtsy.tsx       # Admin dashboard with sync status

functions/
  └── etsy-backend-example.ts # Backend API (recommended)

ETSY_SETUP_GUIDE.md          # Detailed setup instructions
.env.etsy.example            # Environment template
```

---

## Quick Start (3 Steps)

### Step 1: Get Etsy API Credentials

```bash
# Go to: https://www.etsy.com/developers
# Create App → Get API Key, Secret, Access Token
# Find your Shop ID in shop settings
```

### Step 2: Add to Environment

```bash
cp .env.etsy.example .env.local
# Edit .env.local with your Etsy credentials
```

### Step 3: Use in Admin Panel

```typescript
// admin/Store.tsx میں
import EtsySyncService from '../lib/etsySyncService';

const etsySync = new EtsySyncService(
  process.env.VITE_ETSY_ACCESS_TOKEN || '',
  process.env.VITE_ETSY_SHOP_ID || ''
);

// Product add/edit کریں - "Sync to Etsy" option دیکھیں
```

---

## Usage Examples

### Example 1: Create Product (Website + Etsy)

```typescript
import EtsySyncService from './lib/etsySyncService';

const etsySync = new EtsySyncService(accessToken, shopId);

// Create on both platforms
await etsySync.createProductWithEtsySync({
  name: 'Custom Business Cards',
  description: 'Premium 350 GSM business cards with custom design',
  price: 29.99,
  inventory: 100,
  category: 'Print',
  image: '/products/cards.jpg',
  tags: ['business-cards', 'print', 'custom'],
  sku: 'BC-2025-001',
}, true); // true = upload to Etsy
```

**Result:**
- ✅ Product Firestore میں save ہوگی
- ✅ Etsy پر listing create ہوگی
- ✅ Sync status "synced" ہوگی

---

### Example 2: Update Inventory (Real-time Sync)

```typescript
// Website پر inventory update کریں
await etsySync.syncInventoryToEtsy(productId, 75);
```

**Result:**
- ✅ Website پر 75 units update
- ✅ Etsy پر بھی 75 units update
- ✅ Dونوں platforms sync رہیں

---

### Example 3: Fetch Etsy Orders

```typescript
// اپنی database میں Etsy orders sync کریں
await etsySync.syncEtsyOrdersToFirebase();
```

**Result:**
- ✅ Etsy سے تمام paid orders fetch ہوں
- ✅ Firestore میں `etsy_orders` collection میں save ہوں
- ✅ Analytics اور reporting میں use کر سکیں

---

### Example 4: Deactivate on Etsy (Keep on Website)

```typescript
// Website پر رکھیں لیکن Etsy سے remove کریں
await etsySync.deactivateOnEtsy(productId);
```

---

## Firestore Database Schema

### Products Collection

```javascript
{
  id: "prod_123",
  name: "Business Cards",
  price: 29.99,
  inventory: 100,
  category: "Print",
  description: "...",
  status: "active",
  
  // Etsy Fields
  etsyListingId: 987654321,      // Etsy listing ID
  etsySku: "BC-2025-001",         // Etsy SKU
  etsySyncStatus: "synced",       // synced|pending|failed|not-synced
  lastEtsySyncTime: Timestamp,    // آخری sync کا وقت
  syncError: null                 // اگر failed تو error message
}
```

### Etsy Orders Collection

```javascript
{
  etsyOrderId: 123456789,
  orderNumber: "E-123-456-789",
  buyerId: 98765,
  totalPrice: 29.99,
  status: "paid",
  createdAt: Date,
  items: [
    {
      listingId: 987654321,
      quantity: 5,
      price: 29.99
    }
  ],
  syncedAt: Timestamp
}
```

---

## Admin Dashboard Features

### Store Management Page

تمام products ایک جگہ دیکھیں:

| Feature | Description |
|---------|------------|
| Product Name | Product image، name، description |
| Price | فروخت کی قیمت |
| Inventory | Website پر stock quantity |
| Etsy Status | synced / pending / failed / website-only |
| Status | active / archived |
| Actions | Edit / Delete |

### Sync Status Indicators

```
🟢 Synced to Etsy       - Website اور Etsy دونوں پر موجود
🟡 Pending              - Sync in progress
🔴 Sync Failed          - Error رہی، retry button دیکھیں
🔵 Website Only         - صرف website پر ہے، Etsy پر نہیں
```

---

## Best Practices

### ✅ DO's

1. **SKU Unique رکھیں**
   ```typescript
   sku: `${category}-${Date.now()}-${Math.random()}`
   ```

2. **High Quality Images استعمال کریں**
   - Minimum 1024x1024px
   - PNG یا JPG format
   - Professional product photos

3. **Detailed Descriptions لکھیں**
   - Etsy customers کو سب کچھ معلوم ہونا چاہیے
   - Material، size، shipping info شامل کریں

4. **Inventory Realistic رکھیں**
   - Overstock indicators set کریں
   - Regular updates کریں

5. **Backend میں Credentials Store کریں**
   - Access tokens frontend میں expose نہ کریں
   - `functions/etsy-backend-example.ts` follow کریں

### ❌ DON'Ts

1. ❌ Credentials in frontend code
2. ❌ Same SKU on multiple products
3. ❌ Very low inventory values (0-1 units)
4. ❌ Huge image files (>20MB)
5. ❌ Delete products from Etsy manually (sync break ہو جائے)

---

## Troubleshooting

### Problem: "Unauthorized" Error

```
Solution:
1. Access token check کریں (expiry تو نہیں؟)
2. Shop ID verify کریں
3. API Key صحیح ہے؟
4. .env.local میں values check کریں
```

### Problem: Image Upload Fails

```
Solution:
1. Image format JPG/PNG ہے؟
2. Image size < 20MB؟
3. URL accessible ہے؟
4. firestore میں path correctly saved ہے؟
```

### Problem: Inventory Not Syncing

```
Solution:
1. Product پہلے synced ہے؟
2. Etsy پر offering موجود ہے؟
3. Inventory quantity > 0؟
4. Firestore میں etsyListingId موجود ہے?
```

### Problem: Retry Failed Syncs

```typescript
// Failed products کو دوبارہ sync کریں
await etsySync.retryFailedSyncs();

// یہ تمام failed products کو دوبارہ try کرے گا
```

---

## Monitoring & Logging

### Firebase Firestore Rules

```javascript
// Security rules for Etsy sync data
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their products
    match /products/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /etsy_orders/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write
    }
  }
}
```

### Check Sync Status

```typescript
const products = await etsySync.getProductsWithSyncStatus();

products.forEach(p => {
  if (p.etsySyncStatus === 'failed') {
    console.error(`❌ ${p.name}: ${p.syncError}`);
  }
  if (p.etsySyncStatus === 'synced') {
    console.log(`✅ ${p.name} synced`);
  }
});
```

---

## API Rate Limits

Etsy کے limits:

- **500 requests/hour** (per shop)
- **Burst:** 10 requests/minute
- **Retry:** Automatic exponential backoff

اگر rate limit hit ہو:

```typescript
// Wait and retry کریں
setTimeout(() => {
  await etsySync.retryFailedSyncs();
}, 60000); // 1 minute
```

---

## Security Checklist

- [ ] Etsy credentials `.env.local` میں ہیں (committed نہیں)
- [ ] Access token backend میں safely stored ہے
- [ ] Firestore rules restrict کر رہے ہیں (auth required)
- [ ] HTTPS استعمال ہو رہا ہے (production)
- [ ] API keys logged نہیں ہو رہے (console)
- [ ] Regular security audits ہو رہی ہیں

---

## Next Steps

1. **Setup Backend**: `functions/etsy-backend-example.ts` implement کریں
2. **Enable Webhooks**: Etsy events کے لیے webhooks setup کریں
3. **Automated Sync**: Daily orders sync کے لیے cron job setup کریں
4. **Analytics**: Sales data Etsy + website combine کریں
5. **Testing**: Sandbox environment میں test کریں

---

## Support

کوئی issue ہو تو:

1. `ETSY_SETUP_GUIDE.md` پڑھیں
2. Logs check کریں (browser console + Firebase)
3. Etsy API docs دیکھیں: https://developers.etsy.com/docs/
4. Firestore rules verify کریں

**Happy Syncing!** 🚀
