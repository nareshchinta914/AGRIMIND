import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle2, Clock, MapPin, Phone, PackageCheck } from 'lucide-react';

const OrderCard = ({ order, onUpdateStatus, isMerchant = false }) => {
  const statusColors = {
    'Order Placed': 'bg-sky-100 text-sky-800 border-sky-300',
    'Packed at Farm': 'bg-amber-100 text-amber-800 border-amber-300',
    'Out for Delivery': 'bg-purple-100 text-purple-800 border-purple-300',
    'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Cancelled': 'bg-rose-100 text-rose-800 border-rose-300'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
            📦
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Order ID: #{order.id}
            </span>
            <h4 className="text-base font-black text-slate-900 font-display">
              {order.productName}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-black px-3 py-1 rounded-full border ${statusColors[order.status] || 'bg-slate-100 text-slate-800'}`}>
            ● {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Seller Details</span>
          <p className="font-bold text-slate-900">{order.sellerName}</p>
          <p className="text-slate-600">{order.sellerRole === 'FARMER' ? '🌾 Direct Harvest Farm' : '🏢 Verified Merchant'}</p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Quantity & Price</span>
          <p className="font-black text-slate-900 text-sm">₹{order.totalPrice}</p>
          <p className="text-slate-600">{order.quantity} x {order.unit}</p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Delivery Destination</span>
          <p className="text-slate-700 line-clamp-2">{order.deliveryAddress}</p>
        </div>
      </div>

      {/* Real-time Delivery Stepper */}
      {order.deliveryTimeline && (
        <div className="pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {order.deliveryTimeline.map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl border text-left ${
                  step.done
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {step.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{step.step}</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">{step.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isMerchant && onUpdateStatus && (
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2">Update Status:</span>
          <button
            type="button"
            onClick={() => onUpdateStatus(order.id, 'Packed at Farm')}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold"
          >
            Mark Packed
          </button>
          <button
            type="button"
            onClick={() => onUpdateStatus(order.id, 'Out for Delivery')}
            className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold"
          >
            Dispatch 🚚
          </button>
          <button
            type="button"
            onClick={() => onUpdateStatus(order.id, 'Delivered')}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
          >
            Delivered ✅
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default OrderCard;
