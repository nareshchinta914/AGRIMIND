import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Store, Sprout, Building2, ShoppingCart } from 'lucide-react';
import { productService } from '../../services/productService';
import ProductCard from '../../components/dashboard/ProductCard';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const CustomerProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFilterParam = searchParams.get('role') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRole, setSelectedRole] = useState(roleFilterParam);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All',
    'Cereals & Grains',
    'Vegetables',
    'Cash Crops & Fiber',
    'Spices & Condiments'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        category: selectedCategory,
        sellerRole: selectedRole !== 'All' ? selectedRole : undefined,
        page,
        limit: 8
      };
      const res = await productService.getProducts(params);
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedRole, page]);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            🛒 Farm Direct Marketplace
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Browse Farm Fresh Agricultural Produce
          </h2>
          <p className="text-xs text-slate-300">
            Search 500+ verified harvests from certified farmers and grain merchants
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            icon={Search}
            placeholder="Search by crop, paddy, tomatoes, seller name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />

          <Select
            label="Category Filter"
            options={categories.map((c) => ({ value: c, label: c }))}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          />

          <Select
            label="Seller Type"
            options={[
              { value: 'All', label: 'All Sellers' },
              { value: 'FARMER', label: '🌾 Direct Farmers Only' },
              { value: 'MERCHANT', label: '🏢 Verified Merchants Only' }
            ]}
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold">
          Loading fresh harvest catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
          <span className="text-4xl">🌾</span>
          <h4 className="text-base font-black text-slate-900">No crops matched your search</h4>
          <p className="text-xs text-slate-500">Try changing your category or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerProductsPage;
