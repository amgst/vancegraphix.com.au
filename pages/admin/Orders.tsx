import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getOrders, updateOrderStatus, OrderData, OrderStatus } from '../../lib/ordersService';
import { ShoppingCart, Mail, Phone, Calendar, Package, ChevronDown, ChevronUp } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (e) {
        console.error('Error fetching orders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      console.error('Error updating order status', e);
      alert('Failed to update order status.');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Orders</h1>
          <p className="text-gray-500">
            View order requests placed from the public Store. No payments are processed here.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-slate-500">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-4"
                onClick={() => order.id && toggleExpand(order.id)}
              >
                <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{order.customerName}</h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-slate-500 mt-1 md:mt-0">
                      <span className="flex items-center gap-1">
                        <Mail size={14} /> {order.email}
                      </span>
                      {order.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={14} /> {order.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto gap-4 pl-7 md:pl-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  {expandedId === order.id ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </div>
              </div>

              {expandedId === order.id && (
                <div className="border-t border-slate-100 p-6 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                        Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={`${item.productId}-${index}`}
                            className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                <Package size={14} /> {item.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                Qty {item.quantity}
                                {item.sku ? ` • SKU: ${item.sku}` : ''}
                              </p>
                            </div>
                            <div className="text-right text-sm text-slate-800">
                              {item.price > 0 ? (
                                <>
                                  <div>${item.price.toFixed(2)}</div>
                                  <div className="text-xs text-slate-500">
                                    ${(item.price * item.quantity).toFixed(2)} total
                                  </div>
                                </>
                              ) : (
                                <div className="text-xs text-slate-500">Price to confirm</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                        Notes and Status
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 min-h-[80px]">
                          <p className="text-xs text-slate-500 mb-1">Customer notes</p>
                          <p className="text-sm text-slate-800 whitespace-pre-wrap">
                            {order.notes || 'No additional notes provided.'}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-500 mb-2">Update status</p>
                          <div className="flex flex-wrap gap-2">
                            {(['new', 'processing', 'completed', 'cancelled'] as OrderStatus[]).map(
                              status => (
                                <button
                                  key={status}
                                  onClick={e => {
                                    e.stopPropagation();
                                    order.id && handleStatusChange(order.id, status);
                                  }}
                                  disabled={order.status === status}
                                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                    order.status === status
                                      ? 'bg-slate-900 text-white cursor-default'
                                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {status.toUpperCase()}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;

