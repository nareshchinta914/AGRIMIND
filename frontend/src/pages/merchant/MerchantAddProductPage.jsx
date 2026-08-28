import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Upload, Package, DollarSign } from 'lucide-react';
import { productService } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const MerchantAddProductPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Cereals & Grains',
    quantity: '100',
    unit: 'Bags (50kg)',
    price: '2100',
    location: `${user?.district || 'Thanjavur'}, ${user?.state || 'Tamil Nadu'}`,
    description: '',
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await productService.createProduct({
        ...formData,
        sellerId: user?.id || 'merchant_201',
        sellerName: user?.businessName || user?.name || 'Sri Lakshmi Modern Rice Mill',
        sellerRole: 'MERCHANT',
        sellerLocation: formData.location,
        sellerPhone: user?.phone || '9842109876',
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      toast.success('New product listed in AGRIMIND marketplace!');
      navigate('/merchant/products');
    } catch (err) {
      toast.error('Failed to create product listing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        to="/merchant/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Inventory</span>
      </Link>

      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            + New Listing
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Add Agricultural Product to Marketplace
          </h2>
          <p className="text-xs text-slate-300">
            Publish your rice, grains, pulses, or processed agro-commodities for wholesale buyers
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <Input
          label="Product / Commodity Name"
          placeholder="e.g. Premium Aged Basmati Rice (1121 Steam)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={['Cereals & Grains', 'Vegetables', 'Cash Crops & Fiber', 'Spices & Condiments']}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Input
            label="Storage Location / Mandi Yard"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Available Stock Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />

          <Input
            label="Unit of Measurement"
            placeholder="e.g. Bags (25kg) / Quintals / Tons"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            required
          />

          <Input
            label="Selling Price per Unit (₹)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <Input
          label="Product Image URL (Unsplash or direct asset)"
          placeholder="https://images.unsplash.com/photo-..."
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
        />

        <Input
          label="Product Description & Quality Standards"
          placeholder="e.g. Double sorted, 2-year aged, moisture below 12%, suitable for long-term storage."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/merchant/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="amber"
            isLoading={isLoading}
            icon={PlusCircle}
          >
            Publish Product Listing
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MerchantAddProductPage;
