import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, PlusCircle, Search, Edit3, Trash2, ShieldCheck, MapPin } from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const MerchantProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ search: searchQuery });
      setProducts(res.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchQuery]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await productService.deleteProduct(id);
      toast.success('Product removed from inventory');
      loadProducts();
    }
  };

  return (
    <div className="space-y-6 select-none max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            📦 Stock & Inventory
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Merchant Product Catalog
          </h2>
          <p className="text-xs text-slate-300">
            Manage your grain, milling stock, prices, and marketplace listings
          </p>
        </div>

        <Link to="/merchant/products/add">
          <Button variant="amber" size="md" icon={PlusCircle}>
            + Add New Product
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Input
          icon={Search}
          placeholder="Search products in inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Products Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold">Loading inventory...</div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <span className="text-5xl">📦</span>
          <h3 className="text-lg font-black text-slate-900">No products found</h3>
          <Link to="/merchant/products/add">
            <Button variant="amber" size="md">
              Add Your First Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="h-40 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-md">
                    {p.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 font-display line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="font-black text-slate-900 text-base">₹{p.price}</span>
                    <span className="text-slate-500">/ {p.unit}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    Stock: {p.quantity} {p.unit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate(`/merchant/products/edit/${p.id}`)}
                  className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantProductsPage;
