import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Truck, MapPin } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CustomerCartPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [cart, setCart] = useState(orderService.getCart());
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.deliveryAddress || 'Plot 42, Anna Nagar West, Chennai, Tamil Nadu'
  );
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (productId, qty) => {
    const updated = orderService.updateCartQuantity(productId, qty);
    setCart([...updated]);
  };

  const handleRemove = (productId) => {
    const updated = orderService.removeFromCart(productId);
    setCart([...updated]);
    toast.info('Item removed from cart');
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    if (!deliveryAddress.trim()) {
      toast.error('Please provide a delivery address.');
      return;
    }

    setIsPlacing(true);
    try {
      // Place order for each distinct product or bulk order
      for (const item of cart) {
        await orderService.createOrder({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          sellerId: item.product.sellerId,
          sellerName: item.product.sellerName,
          sellerRole: item.product.sellerRole,
          customerId: user?.id || 'cust_301',
          customerName: user?.name || 'Ananya Sharma',
          customerPhone: user?.phone || '9840123456',
          deliveryAddress,
          quantity: item.quantity,
          unit: item.product.unit,
          totalPrice: item.product.price * item.quantity
        });
      }

      setCart([]);
      toast.success('Order placed successfully! Live farm dispatch tracking active.');
      navigate('/customer/orders');
    } catch (err) {
      toast.error('Failed to place order.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            🛍️ Shopping Cart
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Review Your Farm-Fresh Order
          </h2>
          <p className="text-xs text-slate-300">
            Directly from verified harvesting farmers & grain merchants
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <span className="text-5xl">🛒</span>
          <h3 className="text-xl font-black text-slate-900 font-display">Your cart is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover organic harvest fresh crops, rice, wheat, and seasonal vegetables.
          </p>
          <Link to="/customer/products">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 font-display">
                Cart Items ({cart.length})
              </h3>

              <div className="space-y-3 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          {item.product.sellerRole === 'FARMER' ? '🌾 Direct Farmer' : '🏢 Merchant'}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-slate-500">₹{item.product.price} / {item.product.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-slate-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-black text-slate-900 min-w-[70px] text-right">
                        ₹{item.product.price * item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination Input */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Confirm Delivery Destination</span>
              </h3>
              <Input
                label="Full Delivery Address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Door No, Street, Landmark, City, Pincode"
                required
              />
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 h-fit">
            <h3 className="text-base font-black text-slate-900 font-display">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Produce Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Farm-to-Door Delivery</span>
                <span className="font-bold text-emerald-700">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Middlemen Commission</span>
                <span className="font-bold text-emerald-700">₹0 (Zero Markup)</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={Truck}
              isLoading={isPlacing}
              onClick={handlePlaceOrder}
              className="w-full shadow-lg shadow-emerald-600/30"
            >
              Place Order (₹{total})
            </Button>

            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct farmer settlement protected by AGRIMIND</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCartPage;
