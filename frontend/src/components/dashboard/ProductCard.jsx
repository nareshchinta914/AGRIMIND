import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Star, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { useToast } from '../../hooks/useToast';

const ProductCard = ({ product, onAddToCart, onEdit, onDelete, showActions = true }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMerchantOrFarmerOwner = user?.id === product.sellerId || (user?.role === 'MERCHANT' && product.sellerRole === 'MERCHANT');

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    orderService.addToCart(product, 1);
    toast.success(`${product.name} added to your cart!`);
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group transition-all select-none hover:shadow-md"
    >
      <Link to={`/customer/product/${product.id}`} className="block relative">
        <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
              product.sellerRole === 'FARMER'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-slate-950 font-black'
            }`}>
              {product.sellerRole === 'FARMER' ? '🌾 Direct Farmer' : '🏢 Verified Merchant'}
            </span>
          </div>

          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{product.rating || '4.9'}</span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase">{product.category}</span>
          <h4 className="text-sm font-black text-slate-900 font-display line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h4>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="line-clamp-1">{product.location || product.sellerLocation}</span>
          </div>

          <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
            <div>
              <span className="text-lg font-black text-slate-900 font-display">₹{product.price}</span>
              <span className="text-[11px] text-slate-500 ml-1">/ {product.unit}</span>
            </div>

            <span className="text-[11px] font-bold text-emerald-700">
              {product.quantity} in stock
            </span>
          </div>
        </div>
      </Link>

      {showActions && (
        <div className="p-4 pt-0">
          {user?.role === 'CUSTOMER' ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : isMerchantOrFarmerOwner ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onEdit && onEdit(product)}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete && onDelete(product)}
                className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all"
              >
                Delete
              </button>
            </div>
          ) : (
            <Link to={`/customer/product/${product.id}`}>
              <button
                type="button"
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View Details</span>
              </button>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
