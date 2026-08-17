import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ProductWithEtsySync } from '../../lib/etsySyncService';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../lib/productsService';
import { PRODUCTS_SEED_DATA } from '../../data/productsSeed';
import { getProductImageUrl, PRODUCT_IMAGE_PLACEHOLDER } from '../../lib/productImage';
import { Plus, Trash2, Edit2, Save, X, Download, Zap, RefreshCw, Package } from 'lucide-react';

// NOTE: You need to initialize EtsySyncService with your Etsy credentials
// This is a placeholder - you'll need to set up Etsy auth in your settings/environment

const AdminStore: React.FC = () => {
  const [products, setProducts] = useState<ProductWithEtsySync[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductWithEtsySync>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data as ProductWithEtsySync[]);
    } catch (e) {
      console.error('Error fetching products', e);
      alert('Failed to fetch products. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (e) {
      console.error('Error deleting product', e);
      alert('Failed to delete product.');
    }
  };

  const handleEdit = (product: ProductWithEtsySync) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      name: '',
      category: '',
      image: '',
      price: 0,
      shortDescription: '',
      description: '',
      status: 'active',
      inventory: 10,
      etsySyncStatus: 'not-synced',
    });
    setIsEditing(true);
  };

  const handleImportSeed = async () => {
    if (!window.confirm(`This will import ${PRODUCTS_SEED_DATA.length} Print on Demand products. Continue?`)) {
      return;
    }

    setIsImporting(true);
    try {
      const existingProducts = await getProducts();
      const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase()));

      let imported = 0;
      let skipped = 0;

      for (const product of PRODUCTS_SEED_DATA) {
        if (existingNames.has(product.name.toLowerCase())) {
          skipped++;
          continue;
        }

        await addProduct(product);
        imported++;
      }

      alert(`Import complete! Imported: ${imported}, Skipped (already exist): ${skipped}`);
      await fetchProducts();
    } catch (e) {
      console.error('Error importing seed data', e);
      alert('Failed to import products.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.description || !currentProduct.category) return;
    try {
      const price =
        typeof currentProduct.price === 'string'
          ? parseFloat(currentProduct.price)
          : currentProduct.price || 0;

      const data: Omit<ProductWithEtsySync, 'id'> = {
        name: currentProduct.name,
        category: currentProduct.category,
        image: currentProduct.image || '',
        price,
        shortDescription: currentProduct.shortDescription || '',
        description: currentProduct.description,
        sku: currentProduct.sku || '',
        tags: currentProduct.tags || [],
        status: currentProduct.status || 'active',
        inventory: currentProduct.inventory || 10,
        etsySyncStatus: currentProduct.etsySyncStatus || 'not-synced',
      };

      if (currentProduct.id) {
        await updateProduct(currentProduct.id, data);
      } else {
        await addProduct(data);
      }
      await fetchProducts();
      setIsEditing(false);
      setCurrentProduct({});
    } catch (e) {
      console.error('Error saving product', e);
      alert('Failed to save product.');
    }
  };

  const syncEtsyOrders = async () => {
    setIsSyncing(true);
    try {
      // This would call the EtsySyncService to pull Etsy orders
      // For now, just show the UI
      alert('Etsy order sync requires authentication. Set up your Etsy API credentials first.');
    } catch (e) {
      console.error('Error syncing orders', e);
      alert('Failed to sync Etsy orders.');
    } finally {
      setIsSyncing(false);
    }
  };

  const getEtsySyncBadge = (status?: string) => {
    switch (status) {
      case 'synced':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit">
            <Zap size={12} /> Synced to Etsy
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
            <RefreshCw size={12} /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1 w-fit">
            ✕ Sync Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 flex items-center gap-1 w-fit">
            <Package size={12} /> Website Only
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </AdminLayout>
    );
  }

  const syncedCount = products.filter(p => p.etsySyncStatus === 'synced').length;

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Store Products</h1>
            <p className="text-gray-500">
              Manage products that appear on your website and Etsy shop.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleImportSeed}
              disabled={isImporting}
              className="border border-gray-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={18} /> {isImporting ? 'Importing...' : 'Import POD'}
            </button>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* Etsy Sync Status Card */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Zap size={18} className="text-orange-600" /> Etsy Integration Status
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              <strong>{syncedCount}</strong> of <strong>{products.length}</strong> products synced to Etsy
            </p>
          </div>
          <button
            onClick={syncEtsyOrders}
            disabled={isSyncing}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={18} /> {isSyncing ? 'Syncing...' : 'Sync Etsy Orders'}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {products.find(p => p.id === currentProduct.id) ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={currentProduct.name || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.category || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Banners, Business Cards"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentProduct.price ?? ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Leave blank for quote only"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={currentProduct.sku || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
                  <input
                    type="number"
                    value={currentProduct.inventory ?? 10}
                    onChange={e => setCurrentProduct({ ...currentProduct, inventory: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Quantity in stock"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={currentProduct.status || 'active'}
                    onChange={e =>
                      setCurrentProduct({
                        ...currentProduct,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Etsy Sync</label>
                  <select
                    value={currentProduct.etsySyncStatus || 'not-synced'}
                    onChange={e =>
                      setCurrentProduct({
                        ...currentProduct,
                        etsySyncStatus: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="not-synced">Website Only</option>
                    <option value="synced">Sync to Etsy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={currentProduct.shortDescription || ''}
                  onChange={e =>
                    setCurrentProduct({ ...currentProduct, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Shown on listing cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  required
                  rows={5}
                  value={currentProduct.description || ''}
                  onChange={e =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image (URL or Filename)</label>
                {currentProduct.image && (
                  <div className="mb-3">
                    <img
                      src={getProductImageUrl(currentProduct.image)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
                      }}
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={currentProduct.image || ''}
                  onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://... or /products/foo.jpg or foo.jpg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={18} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etsy Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 flex items-center gap-3">
                  {product.image && (
                    <img
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
                      }}
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                    <div className="text-xs text-gray-500">
                      {product.shortDescription || product.description.slice(0, 80)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{product.category}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {product.price ? `$${product.price.toFixed(2)}` : 'Quote'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {product.inventory || 0} units
                </td>
                <td className="px-4 py-3 text-sm">
                  {getEtsySyncBadge(product.etsySyncStatus)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.status === 'active' ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={7}>
                  No products found. Use "Add Product" to create your first item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminStore;
