# Etsy Integration - Quick Reference

## 🚀 What You Now Have

### 1. **Core Services**

| File | Purpose |
|------|---------|
| `lib/etsyService.ts` | Etsy API wrapper - communicate کریں Etsy سے |
| `lib/etsySyncService.ts` | Sync logic - website ↔ Etsy sync کریں |
| `pages/admin/StoreWithEtsy.tsx` | Admin dashboard - products manage کریں |

### 2. **Backend Example**

| File | Purpose |
|------|---------|
| `functions/etsy-backend-example.ts` | Secure backend API - credentials safely handle کریں |

### 3. **Documentation**

| File | Purpose |
|------|---------|
| `ETSY_SETUP_GUIDE.md` | Step-by-step setup instructions |
| `ETSY_INTEGRATION_GUIDE.md` | Complete integration guide with examples |
| `.env.etsy.example` | Environment variables template |

---

## 🎯 Key Features

```
✅ Two-way Sync
   Website ←→ Etsy

✅ Real-time Inventory
   Update 1 jaga - reflect ہو دوسری جگہ

✅ Automatic Retry
   Failed syncs خود retry ہوں

✅ Order Syncing
   Etsy orders اپنی database میں آ جائیں

✅ Error Tracking
   کون سے syncs fail ہوئے - track کریں
```

---

## 📋 Usage Workflow

### Step 1: Get Etsy Credentials
```
https://www.etsy.com/developers → Create App
Get: API Key, Secret, Access Token, Shop ID
```

### Step 2: Setup Environment
```bash
cp .env.etsy.example .env.local
# Edit with your Etsy credentials
```

### Step 3: Use Admin Dashboard
```
Admin Panel → Store
- Add Product
- Check "Sync to Etsy"
- Save → Product on both platforms!
```

### Step 4: Sync Orders (Optional)
```
"Sync Etsy Orders" button
→ All Etsy orders اپنی database میں
→ Analytics میں use کریں
```

---

## 💻 Code Examples

### Create Product (Both Platforms)
```typescript
await etsySync.createProductWithEtsySync({
  name: 'Business Cards',
  description: 'Premium cards',
  price: 29.99,
  inventory: 100,
  category: 'Print',
  // ... more fields
}, true); // true = sync to Etsy
```

### Update Inventory
```typescript
// Website پر update → Etsy پر بھی update
await etsySync.syncInventoryToEtsy(productId, 75);
```

### Get Etsy Orders
```typescript
const { orders } = await etsyService.getOrders({
  limit: 100,
  status: 'paid'
});
// orders میں Etsy سے تمام paid orders
```

---

## 🔐 Security Checklist

- [ ] `.env.local` میں Etsy credentials
- [ ] `.env.local` in `.gitignore` (never commit)
- [ ] Backend میں access token store کریں
- [ ] Frontend میں secrets expose نہ کریں
- [ ] Firestore rules authenticate کریں

---

## 📊 Firestore Schema

### Products Collection
```
id (auto)
  ├─ name
  ├─ price
  ├─ inventory
  ├─ etsyListingId ← Etsy سے link
  ├─ etsySyncStatus ← synced/pending/failed
  └─ lastEtsySyncTime ← آخری sync کب
```

### Etsy Orders Collection
```
etsyOrderId (unique)
  ├─ orderNumber
  ├─ totalPrice
  ├─ status
  ├─ items (product details)
  └─ syncedAt
```

---

## 🛠️ What's Next

### Priority 1 (Must Do)
1. [ ] Get Etsy API credentials
2. [ ] Setup `.env.local`
3. [ ] Test in admin panel

### Priority 2 (Recommended)
1. [ ] Setup backend (for security)
2. [ ] Test product creation
3. [ ] Test inventory sync

### Priority 3 (Nice to Have)
1. [ ] Setup order syncing
2. [ ] Create analytics dashboard
3. [ ] Setup automated daily sync

---

## 🐛 Debugging

### Check Sync Status
```typescript
// See all products with sync status
const products = await etsySync.getProductsWithSyncStatus();
products.forEach(p => {
  console.log(p.name, '→', p.etsySyncStatus);
});
```

### Retry Failed
```typescript
// Auto-retry all failed syncs
await etsySync.retryFailedSyncs();
```

### View Logs
```
Browser Console (Frontend)
  - Etsy API calls
  - Firestore operations
  
Firebase Console
  - Document creation/updates
  - Error tracking
  
Vercel/Backend Logs
  - API errors
  - Rate limiting
```

---

## 📞 Common Issues

| Issue | Solution |
|-------|----------|
| "Unauthorized" | Check access token expiry |
| Sync fails | Check Firestore rules |
| Images not upload | Check image format/size |
| Inventory wrong | Verify Firebase path |
| Orders don't sync | Check shop ID |

---

## 📚 Helpful Links

- [Etsy API Docs](https://developers.etsy.com/docs/)
- [OAuth Flow](https://developers.etsy.com/docs/oauth)
- [API Rate Limits](https://developers.etsy.com/docs/rate-limiting)
- [Firestore Security](https://firebase.google.com/docs/rules)

---

## 🎓 File Structure

```
your-app/
├── lib/
│   ├── etsyService.ts ........... Core API
│   └── etsySyncService.ts ....... Sync logic
├── pages/admin/
│   └── StoreWithEtsy.tsx ........ Admin UI
├── functions/
│   └── etsy-backend-example.ts .. Backend API
├── ETSY_SETUP_GUIDE.md .......... Setup steps
├── ETSY_INTEGRATION_GUIDE.md .... Full guide
└── .env.etsy.example ........... Template
```

---

## ✨ Summary

**اب آپ کر سکتے ہیں:**

1. ✅ Website پر products add کریں
2. ✅ "Sync to Etsy" click کریں  
3. ✅ Product خودکار Etsy پر آ جائے
4. ✅ Inventory دونوں جگہ sync رہے
5. ✅ Etsy orders اپنی database میں آئیں

**بس یہ 5 کام - اور بہت سارے فوائد!**

🎉 Happy E-Commerce! 🎉
