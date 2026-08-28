import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, Filter } from 'lucide-react';
import { orderService } from '../../services/orderService';
import OrderCard from '../../components/dashboard/OrderCard';
import { useToast } from '../../hooks/useToast';

const MerchantOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders();
      setOrders(res.orders || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    toast.success(`Order #${orderId} marked as ${newStatus}!`);
    loadOrders();
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            🛒 Buyer Orders & Shipments
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Orders & Delivery Fulfillment
          </h2>
          <p className="text-xs text-slate-300">
            Process buyer orders, assign freight trucks, and update delivery status
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <span className="text-5xl">📦</span>
          <h3 className="text-lg font-black text-slate-900">No active customer orders right now</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isMerchant={true}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantOrdersPage;
