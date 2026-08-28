import React, { useState, useEffect } from 'react';
import { Store, Plus, TrendingUp, Search, Filter, Phone, Building2, User, Salad, RefreshCw } from 'lucide-react';
import { productService } from '../../services/productService';
import { marketService } from '../../services/marketService';
import ProductCard from '../../components/dashboard/ProductCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const FarmerMarketplacePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    name: 'Farm Fresh Country Tomatoes (Grade-A)',
    category: 'Vegetables',
    quantity: '40',
    unit: 'Crates (25kg)',
    price: '680',
    location: `${user?.district || 'Thanjavur'}, ${user?.state || 'Tamil Nadu'}`,
    description: 'Freshly harvested country tomatoes with natural flavor. Plucked early morning, ideal for retail and hotel supplies.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, mandiRes] = await Promise.all([
        productService.getProducts(),
        marketService.getMandiPrices({ category: 'Vegetables' })
      ]);
      setProducts(prodRes.products || []);
      setMandiPrices(mandiRes.prices || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateHarvestListing = async (e) => {
    e.preventDefault();
    try {
      await productService.createProduct({
        ...formData,
        sellerId: user?.id || 'farmer_101',
        sellerName: user?.name || 'Naresh Chinta (Farmer)',
        sellerRole: 'FARMER',
        sellerLocation: formData.location,
        sellerPhone: user?.phone || '9876543210',
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      setIsAddModalOpen(false);
      toast.success('Harvest listed! 1,500+ millers, supermarkets and customers can now bid directly.');
      loadData();
    } catch (err) {
      toast.error('Failed to publish listing');
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/20">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
            🛒 Direct Farmer Mandi & Selling
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Sell Harvest & Vegetables to Millers & Supermarkets
          </h2>
          <p className="text-xs text-emerald-100/80">
            Post vegetables and farm harvests directly without middlemen or commission agents
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/marketplace">
            <Button variant="outline" size="md" className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
              Live Mandi Rates
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
            className="shadow-lg shadow-emerald-600/30"
          >
            + Post Harvest for Sale
          </Button>
        </div>
      </div>

      {/* Live Benchmark Mandi Rates for Pricing Reference */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Salad className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900 font-display">
              Live APMC Benchmark Rates for Price Calibration
            </h3>
          </div>
          <Link to="/marketplace" className="text-xs font-bold text-emerald-700 hover:underline">
            View All 18+ Mandis →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mandiPrices.slice(0, 6).map((item) => (
            <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md truncate block">
                {item.state}
              </span>
              <p className="text-xs font-black text-slate-900 truncate">{item.commodity.split('(')[0]}</p>
              <p className="text-sm font-black text-emerald-700">{formatCurrency(item.modalPrice)}/Qtl</p>
              <p className="text-[10px] text-slate-500 font-bold">₹{(item.pricePerKg || item.modalPrice / 100).toFixed(0)}/kg</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', 'Vegetables', 'Cereals & Grains', 'Cash Crops & Fiber', 'Spices & Condiments'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'Vegetables' ? '🥦 Vegetables' : cat === 'Cereals & Grains' ? '🌾 Grains & Rice' : cat}
          </button>
        ))}
      </div>

      {/* Live Active Listings */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display">
          Active Marketplace Listings ({filteredProducts.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Post Harvest Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Sell Your Farm Harvest / Vegetables Directly">
        <form onSubmit={handleCreateHarvestListing} className="space-y-4">
          <Input
            label="Produce Name & Variety"
            placeholder="e.g. Farm Fresh Country Tomatoes (Grade-A)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              options={['Vegetables', 'Cereals & Grains', 'Cash Crops & Fiber', 'Spices & Condiments']}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              label="Location / Mandi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Harvest Quantity Available"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
            <Input
              label="Unit of Measurement"
              placeholder="e.g. Crates (25kg) / Bags (50kg) / Quintals"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
            />
          </div>

          <Input
            label="Selling Price per Unit (₹)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <Input
            label="Harvest Quality & Farm Notes"
            placeholder="e.g. Naturally ripened, Grade-A sorted, early morning harvest"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FarmerMarketplacePage;
