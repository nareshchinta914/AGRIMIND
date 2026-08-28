import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit3, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const MerchantEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Cereals & Grains',
    quantity: '',
    unit: '',
    price: '',
    location: '',
    description: '',
    image: '',
    available: true
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const p = await productService.getProductById(id);
        setFormData({
          name: p.name || '',
          category: p.category || 'Cereals & Grains',
          quantity: p.quantity || '',
          unit: p.unit || '',
          price: p.price || '',
          location: p.location || '',
          description: p.description || '',
          image: p.image || '',
          available: p.available ?? true
        });
      } catch (err) {
        toast.error('Product not found');
        navigate('/merchant/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await productService.updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      toast.success('Product updated successfully!');
      navigate('/merchant/products');
    } catch (err) {
      toast.error('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-bold">Loading product details...</div>;
  }

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
            ✏️ Edit Listing
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Update Listing: {formData.name}
          </h2>
          <p className="text-xs text-slate-300">
            Adjust stock quantity, pricing, and availability status
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <Input
          label="Product / Commodity Name"
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
          label="Product Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
        />

        <Input
          label="Product Description"
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
            isLoading={isSaving}
            icon={Save}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MerchantEditProductPage;
