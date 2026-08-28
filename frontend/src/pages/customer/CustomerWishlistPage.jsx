import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import ProductCard from '../../components/dashboard/ProductCard';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const CustomerWishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(orderService.getWishlist());
  }, []);

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-rose-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            ❤️ Saved Wishlist
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Favorite Farm Produce & Crops
          </h2>
          <p className="text-xs text-slate-300">
            Quickly re-order your favorite farm produce and grain varieties
          </p>
        </div>

        <Link to="/customer/products">
          <Button variant="primary" size="md" icon={ShoppingBag}>
            Explore More Crops
          </Button>
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <span className="text-5xl">❤️</span>
          <h3 className="text-xl font-black text-slate-900 font-display">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save crops and farm harvests to your wishlist while browsing.
          </p>
          <Link to="/customer/products">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerWishlistPage;
