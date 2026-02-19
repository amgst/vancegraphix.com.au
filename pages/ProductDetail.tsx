import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, Loader, Tag, ArrowLeft, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../data/productsData';
import { getProductById } from '../lib/productsService';
import { submitOrder } from '../lib/ordersService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    quantity: 1,
    notes: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (e) {
        console.error('Error loading product', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value || '1', 10)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!formData.customerName || !formData.email) {
      setFormError('Name and email are required.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      await submitOrder({
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        items: [
          {
            productId: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price || 0,
            quantity: formData.quantity,
          },
        ],
      });
      setSubmitted(true);
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        quantity: 1,
        notes: '',
      });
    } catch (err) {
      console.error('Error submitting order', err);
      setFormError('Failed to submit order. Please try again or contact us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/store" replace />;
  }

  const pageTitle = `${product.name} | Vance Graphix & Print (VGP)`;
  const description = product.shortDescription || product.description;

  const lineTotal =
    (product.price || 0) * (formData.quantity && formData.quantity > 0 ? formData.quantity : 1);

  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://vancegraphix.com.au/store/${product.id}`} />
      </Helmet>

      <div className="bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/store" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft size={16} className="mr-1" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <ShoppingCart size={48} className="text-slate-400" />
            )}
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                <Tag size={12} className="mr-1" />
                {product.category}
              </span>
              {product.sku && (
                <span className="text-xs text-gray-500">SKU: {product.sku}</span>
              )}
            </div>
            <p className="text-lg text-gray-600 mb-4">{product.shortDescription}</p>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Order this product</h2>
              {product.price ? (
                <p className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
              ) : (
                <p className="text-sm font-semibold text-slate-600">Price will be confirmed by VGP.</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                No payment is taken on this website. Your request will be sent to the VGP team to confirm
                details and pricing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min={1}
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                {product.price ? (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Estimated total</p>
                    <p className="text-lg font-bold text-slate-900">${lineTotal.toFixed(2)}</p>
                  </div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes or specifications
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Include size, material, quantity breakdown or any other details."
                />
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Sending order...
                  </>
                ) : (
                  <>
                    Submit order request
                    <ShoppingCart size={16} />
                  </>
                )}
              </button>

              {submitted && (
                <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
                  <CheckCircle size={14} className="mt-0.5" />
                  <p>
                    Thank you. Your order request has been sent to the VGP team. We will contact you to
                    confirm pricing and next steps.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

