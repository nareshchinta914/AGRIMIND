import React, { useState, useEffect } from 'react';
import { Package, Truck, Clock, CheckCircle2, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/orderService';
import OrderCard from '../../components/dashboard/OrderCard';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders();
        setOrders(res.orders || []);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-purple-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            📦 Order Tracking
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            My Farm-Direct Orders
          </h2>
          <p className="text-xs text-slate-300">
            Real-time status tracking directly from harvesting farms & mills
          </p>
        </div>

        <Link to="/customer/products">
          <Button variant="primary" size="md" icon={ShoppingBag}>
            Shop More Produce
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <span className="text-5xl">📦</span>
          <h3 className="text-xl font-black text-slate-900 font-display">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Order organic grains and farm-fresh produce directly from local farmers.
          </p>
          <Link to="/customer/products">
            <Button variant="primary" size="md">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
