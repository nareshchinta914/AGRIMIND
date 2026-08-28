import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  ArrowLeft,
  Truck,
  Heart,
  CheckCircle2,
  Building2,
  Sprout
} from 'lucide-react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';

const CustomerProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        toast.error('Product not found');
        navigate('/customer/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return <div className="p-12 text-center text-slate-500 font-bold">Loading product details...</div>;
  }

  const handleAddToCart = () => {
    orderService.addToCart(product, quantity);
    toast.success(`Added ${quantity} x ${product.name} to cart!`);
    navigate('/customer/cart');
  };

  const handleToggleWishlist = () => {
    const res = orderService.toggleWishlist(product);
    toast.info(res.inWishlist ? 'Saved to your Wishlist ❤️' : 'Removed from Wishlist');
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        to="/customer/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products Marketplace</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        {/* Product Image & Badges */}
        <div className="space-y-4">
          <div className="h-80 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              {product.sellerRole === 'FARMER' ? '🌾 Direct Farmer Harvest' : '🏢 Grain Merchant'}
            </span>
          </div>

          {/* Seller Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                  {product.sellerRole === 'FARMER' ? '👨‍🌾' : '🏢'}
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-900">{product.sellerName}</h5>
                  <p className="text-xs text-slate-500">📍 {product.location || product.sellerLocation}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified
              </span>
            </div>

            {product.sellerPhone && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Direct Seller Line:</span>
                <a
                  href={`tel:${product.sellerPhone}`}
                  className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{product.sellerPhone}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-900">{product.rating}</span>
                <span>({product.reviewsCount} customer ratings)</span>
              </div>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{product.quantity} in stock</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-3xl font-black text-slate-900 font-display">
                ₹{product.price}
                <span className="text-xs text-slate-600 font-normal ml-2">/ {product.unit}</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-bold mt-1">
                ✓ No middleman markup. Directly from harvesting source.
              </p>
            </div>

            <div className="space-y-1 text-xs text-slate-700">
              <h4 className="font-black text-slate-900">Product & Harvest Quality:</h4>
              <p className="leading-relaxed text-slate-600">{product.description}</p>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Order Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold text-xs text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500 font-medium">Total: ₹{product.price * quantity}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={ShoppingCart}
                onClick={handleAddToCart}
                className="w-full shadow-lg shadow-emerald-600/30"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Heart}
                onClick={handleToggleWishlist}
                className="w-full"
              >
                Save to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductDetailPage;
