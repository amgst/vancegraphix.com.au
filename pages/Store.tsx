import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, Loader, Package } from 'lucide-react';
import SEO from '../components/SEO';
import { Product } from '../data/productsData';
import { getProducts } from '../lib/productsService';

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data.filter(p => p.status !== 'archived'));
      } catch (e) {
        console.error('Error fetching products', e);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'VGP POD',
    description: 'Print on demand products you can order directly from VGP.',
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO
        title="POD | Print on Demand Products"
        description="Browse print on demand products from Vance Graphix & Print (VGP). Request an order for print, signage and marketing materials without online payment."
        canonical="/store"
        structuredData={structuredData}
      />

      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-4">
              <ShoppingCart size={14} />
              <span>VGP POD</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Order Print, Signage and Marketing Materials
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Select a product, review the details and submit an order request. Our team will confirm pricing
              and payment offline before production.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="rounded-3xl bg-slate-900 text-white px-8 py-6 shadow-xl flex items-center gap-4">
              <Package size={32} className="text-yellow-400" />
              <div>
                <p className="text-sm text-slate-300">Products available</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products are available yet. Please check back soon or contact us for a custom quote.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/store/${product.id}`}
                className="group border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                {product.image && (
                  <div className="aspect-[4/3] bg-slate-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                      <Tag size={12} className="mr-1" />
                      {product.category}
                    </span>
                    {product.price ? (
                      <span className="text-sm font-bold text-slate-900">
                        ${product.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">Price on request</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 flex-1">
                    {product.shortDescription || product.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-sm font-medium text-blue-600">
                    <span>View details</span>
                    <ShoppingCart size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;

