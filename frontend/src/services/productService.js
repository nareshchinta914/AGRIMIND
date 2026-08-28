import api from './api';

// Initial dynamic products dataset supporting FARMER -> BUYER, MERCHANT -> BUYER, FARMER -> MERCHANT
const INITIAL_PRODUCTS = [
  {
    id: 'prod_veg_1',
    sellerId: 'farmer_102',
    sellerName: 'Ramesh Kumar (Organic Farmer)',
    sellerRole: 'FARMER',
    sellerLocation: 'Salem, Tamil Nadu',
    sellerPhone: '9876543210',
    name: 'Farm Fresh Country Tomatoes (Grade-A / Harvest Fresh)',
    category: 'Vegetables',
    quantity: 120,
    unit: 'Crates (25kg each)',
    price: 680,
    pricePerUnit: '₹680 / Crate (₹27.2/kg)',
    location: 'Salem Farmers Market Yard',
    description: 'Juicy, naturally ripened country red tomatoes plucked directly this morning. Excellent for household cooking, retail stores, and hotel bulk supply.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.9,
    reviewsCount: 52,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'prod_veg_2',
    sellerId: 'farmer_105',
    sellerName: 'M. Anandhan',
    sellerRole: 'FARMER',
    sellerLocation: 'Ooty / Nilgiris, Tamil Nadu',
    sellerPhone: '9443312345',
    name: 'Nilgiri Organic Sweet Carrots (Kuroda Fresh Crisp)',
    category: 'Vegetables',
    quantity: 85,
    unit: 'Bags (50kg)',
    price: 1700,
    pricePerUnit: '₹1,700 / Bag (₹34/kg)',
    location: 'Ooty Mettupalayam Market',
    description: 'High altitude mountain-grown crunchy sweet carrots. Soil washed, grade sorted, and ready for retail supermarket packaging.',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 5.0,
    reviewsCount: 41,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'prod_veg_3',
    sellerId: 'farmer_106',
    sellerName: 'S. Selvam (Moringa Farmer)',
    sellerRole: 'FARMER',
    sellerLocation: 'Dindigul, Tamil Nadu',
    sellerPhone: '9842198765',
    name: 'ODC-3 Green Drumsticks (Tender Long Moringa Pods)',
    category: 'Vegetables',
    quantity: 60,
    unit: 'Bundles (40kg)',
    price: 2500,
    pricePerUnit: '₹2,500 / Bundle (₹62.5/kg)',
    location: 'Dindigul Vegetable Mandi',
    description: 'Fleshy, tender, fiber-less ODC-3 hybrid drumsticks freshly cut from organic orchards. High export & domestic market demand.',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.8,
    reviewsCount: 29,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'prod_veg_4',
    sellerId: 'farmer_107',
    sellerName: 'P. Muthusamy',
    sellerRole: 'FARMER',
    sellerLocation: 'Oddanchatram, Tamil Nadu',
    sellerPhone: '9789054321',
    name: 'Fresh Green Chillies (G-4 Spicy Sharp Grade-1)',
    category: 'Vegetables',
    quantity: 45,
    unit: 'Bags (30kg)',
    price: 1350,
    pricePerUnit: '₹1,350 / Bag (₹45/kg)',
    location: 'Oddanchatram APMC Yard',
    description: 'Glossy dark green sharp chillies with high pungency and extended shelf life (10+ days under ambient cooling).',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.9,
    reviewsCount: 34,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'prod_veg_5',
    sellerId: 'farmer_108',
    sellerName: 'K. Balaji',
    sellerRole: 'FARMER',
    sellerLocation: 'Kodaikanal, Tamil Nadu',
    sellerPhone: '9442167890',
    name: 'Kodaikanal Malai Poondu (Hill Garlic - GI Tagged)',
    category: 'Vegetables',
    quantity: 35,
    unit: 'Bags (25kg)',
    price: 5800,
    pricePerUnit: '₹5,800 / Bag (₹232/kg)',
    location: 'Kodaikanal Hill Market',
    description: 'Famous medicinal GI-tagged Kodaikanal hill garlic with intense allicin content and supreme medicinal properties.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 5.0,
    reviewsCount: 68,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'prod_veg_6',
    sellerId: 'farmer_109',
    sellerName: 'V. Venkatesh',
    sellerRole: 'FARMER',
    sellerLocation: 'Hosur, Tamil Nadu',
    sellerPhone: '9843322110',
    name: 'Polyhouse Green Capsicum & Bell Peppers',
    category: 'Vegetables',
    quantity: 70,
    unit: 'Crates (15kg)',
    price: 600,
    pricePerUnit: '₹600 / Crate (₹40/kg)',
    location: 'Hosur Polyhouse Hub',
    description: 'Crisp, thick-walled greenhouse bell peppers with brilliant glossy green color. Grown with drip fertigation.',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.8,
    reviewsCount: 23,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'prod_grain_1',
    sellerId: 'farmer_101',
    sellerName: 'K. Murugan',
    sellerRole: 'FARMER',
    sellerLocation: 'Thanjavur, Tamil Nadu',
    sellerPhone: '9840123456',
    name: 'Organic Traditional Ponni Paddy (Harvest Fresh)',
    category: 'Cereals & Grains',
    quantity: 120,
    unit: 'Bags (75kg each)',
    price: 2450,
    pricePerUnit: '₹2,450 / Bag (₹32.6/kg)',
    location: 'Thanjavur APMC Yard',
    description: 'Naturally cultivated Ponni paddy grown using organic vermicompost. Moisture level is 13% (Ideal for long storage & milling). Ready for immediate loading.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.9,
    reviewsCount: 38,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'prod_grain_2',
    sellerId: 'merchant_201',
    sellerName: 'Sri Lakshmi Modern Rice Mill',
    sellerRole: 'MERCHANT',
    sellerLocation: 'Thanjavur, Tamil Nadu',
    sellerPhone: '9842109876',
    name: 'Premium Aged Basmati Rice (1121 Steam Extra Long)',
    category: 'Cereals & Grains',
    quantity: 450,
    unit: 'Bags (25kg)',
    price: 1850,
    pricePerUnit: '₹1,850 / Bag (₹74/kg)',
    location: 'Thanjavur Rice Mill Complex',
    description: '2-year aged aromatic 1121 steam Basmati grain. Cook length doubles with authentic aroma. Double sorted & de-stoned.',
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 5.0,
    reviewsCount: 89,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'prod_spice_1',
    sellerId: 'farmer_104',
    sellerName: 'Anbu Selvan',
    sellerRole: 'FARMER',
    sellerLocation: 'Erode, Tamil Nadu',
    sellerPhone: '9789012345',
    name: 'Erode Finger Turmeric (High Curcumin 4.5%)',
    category: 'Spices & Condiments',
    quantity: 140,
    unit: 'Bags (50kg)',
    price: 6800,
    pricePerUnit: '₹6,800 / Bag (₹136/kg)',
    location: 'Erode Turmeric Market',
    description: 'GI Tagged Erode finger turmeric, sun dried on traditional clean drying yards. Deep golden yellow color.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    available: true,
    rating: 4.9,
    reviewsCount: 64,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

// Helper to get local dynamic products from localStorage or fallback
const getLocalProducts = () => {
  const stored = localStorage.getItem('agrimind_products_v2');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // Fallback
    }
  }
  localStorage.setItem('agrimind_products_v2', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

const saveLocalProducts = (products) => {
  localStorage.setItem('agrimind_products_v2', JSON.stringify(products));
};

export const productService = {
  /**
   * GET /api/products
   * Supports search, category, role filter, and pagination
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      if (response && response.products && response.products.length > 0) {
        return response;
      }
      throw new Error('Fallback to local dynamic dataset');
    } catch (err) {
      // Offline / Demo fallback with dynamic search & filtering
      let products = getLocalProducts();

      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.sellerName.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query)
        );
      }

      if (params.category && params.category !== 'All') {
        products = products.filter((p) => p.category === params.category);
      }

      if (params.sellerRole) {
        products = products.filter((p) => p.sellerRole === params.sellerRole);
      }

      if (params.sellerId) {
        products = products.filter((p) => p.sellerId === params.sellerId);
      }

      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 12;
      const total = products.length;
      const start = (page - 1) * limit;
      const paginated = products.slice(start, start + limit);

      return {
        products: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1
      };
    }
  },

  /**
   * GET /api/products/:id
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.product || response;
    } catch (err) {
      const products = getLocalProducts();
      const found = products.find((p) => p.id === id);
      if (!found) {
        throw new Error('Product not found');
      }
      return found;
    }
  },

  /**
   * POST /api/products
   */
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response;
    } catch (err) {
      const products = getLocalProducts();
      const newProduct = {
        id: 'prod_' + Date.now(),
        createdAt: new Date().toISOString(),
        available: true,
        rating: 5.0,
        reviewsCount: 1,
        ...productData
      };
      const updated = [newProduct, ...products];
      saveLocalProducts(updated);
      return { success: true, product: newProduct, message: 'Product published to AGRIMIND marketplace!' };
    }
  },

  /**
   * PUT /api/products/:id
   */
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response;
    } catch (err) {
      const products = getLocalProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Product not found');

      products[index] = { ...products[index], ...productData, updatedAt: new Date().toISOString() };
      saveLocalProducts(products);
      return { success: true, product: products[index], message: 'Product updated successfully!' };
    }
  },

  /**
   * DELETE /api/products/:id
   */
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response;
    } catch (err) {
      const products = getLocalProducts();
      const filtered = products.filter((p) => p.id !== id);
      saveLocalProducts(filtered);
      return { success: true, message: 'Product deleted from marketplace.' };
    }
  }
};
