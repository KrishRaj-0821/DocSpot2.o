import React, { useState, useEffect } from 'react';
import api from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';
import { FiPackage, FiTruck, FiMapPin, FiEye, FiDownload, FiDollarSign, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const PatientOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.filter(o => o.userEmail === user?.email));
      } catch (err) {
        toast.error("Failed to load medicine orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleDownloadInvoice = (id) => {
    toast.success(`Invoice #${id} downloading...`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading medicine orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Medicine Orders</h1>
        <p className="text-xs text-slate-500">Track delivery status, review pharmacy shopping logs, and download invoices.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-md border dark:bg-slate-800 dark:border-slate-800">
          <FiPackage className="h-12 w-12 text-slate-350 mx-auto mb-3" />
          <p className="text-xs text-slate-400 italic">No medicine orders found. Head to the Medicines Store to order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {orders.map(order => (
            <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5 overflow-hidden">
                <div className={`rounded-xl p-3 shrink-0 ${
                  order.status === 'Delivered' 
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400' 
                    : 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400'
                }`}>
                  <FiPackage className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-tight truncate">
                    Order Reference: #{order.id}
                  </h4>
                  <p className="text-[10px] text-slate-450 mt-0.5">{order.date} | ₹{order.total}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-1">Items: {order.items.map(i => i.name).join(', ')}</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="rounded-lg p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30"
                  title="Track Order"
                >
                  <FiEye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDownloadInvoice(order.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Download Invoice"
                >
                  <FiDownload className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Track Order / Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          
          <div className="w-full max-w-xl bg-white rounded-3xl z-10 shadow-2xl overflow-hidden border border-slate-200 dark:bg-slate-900 dark:border-slate-850">
            <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Order Detail Tracker</h3>
                <p className="text-[10px] text-slate-450">ID: #{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-450 hover:text-slate-850 text-xl font-bold dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Delivery Progress Timelines */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Delivery Status</h4>
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-1.5 top-1 h-3/4 w-0.5 bg-slate-100 dark:bg-slate-700" />
                  
                  <div className="flex items-center space-x-3 relative">
                    <span className="flex h-3.5 w-3.5 rounded-full bg-teal-500 ring-4 ring-teal-50 dark:ring-teal-950 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Order Confirmed</p>
                      <span className="text-[10px] text-slate-400">Processed by system on {selectedOrder.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 relative">
                    <span className={`flex h-3.5 w-3.5 rounded-full ring-4 shrink-0 ${
                      selectedOrder.status !== 'Delivered' 
                        ? 'bg-teal-500 ring-teal-50 animate-pulse dark:ring-teal-950' 
                        : 'bg-teal-550 ring-teal-50'
                    }`} />
                    <div>
                      <p className="text-xs font-bold text-slate-905 dark:text-white">In Transit</p>
                      <span className="text-[10px] text-slate-400">Dispatched from DocSpot central vendor</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 relative">
                    <span className={`flex h-3.5 w-3.5 rounded-full ring-4 shrink-0 ${
                      selectedOrder.status === 'Delivered' 
                        ? 'bg-teal-500 ring-teal-50' 
                        : 'bg-slate-200 ring-slate-100 dark:bg-slate-700 dark:ring-slate-800'
                    }`} />
                    <div>
                      <p className="text-xs font-bold text-slate-905 dark:text-white">Delivered to Address</p>
                      <span className="text-[10px] text-slate-400">Delivered to: {selectedOrder.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Itemized Invoice</h4>
                <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 space-y-3">
                  {selectedOrder.items.map((item, idx) => {
                    const finalPrice = Math.round(item.price - (item.price * (item.discount || 0)) / 100);
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-205">{item.name}</p>
                          <span className="text-[10px] text-slate-400">Qty: {item.quantity} | ₹{finalPrice} each</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">₹{finalPrice * item.quantity}</span>
                      </div>
                    );
                  })}

                  <div className="border-t border-slate-50 pt-3 dark:border-slate-800 text-xs space-y-1.5 text-slate-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>+₹{selectedOrder.deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Taxes</span>
                      <span>+₹{selectedOrder.tax}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Total Charges</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-150 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:hover:bg-slate-800"
              >
                Close Tracking
              </button>
              <button
                onClick={() => handleDownloadInvoice(selectedOrder.id)}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-750"
              >
                Print Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default PatientOrders;
