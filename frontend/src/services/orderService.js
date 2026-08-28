import api from './api';

const INITIAL_ORDERS = [
  {
    id: 'ord_1001',
    productId: 'prod_1',
    productName: 'Organic Traditional Ponni Paddy',
    productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    sellerId: 'farmer_101',
    sellerName: 'K. Murugan (Farmer)',
    sellerRole: 'FARMER',
    customerId: 'cust_301',
    customerName: 'Ananya Sharma',
    customerPhone: '9840123456',
    deliveryAddress: 'Plot 42, Anna Nagar West, Chennai, Tamil Nadu',
    quantity: 2,
    unit: 'Bags (75kg)',
    totalPrice: 4900,
    status: 'Out for Delivery',
    paymentMethod: 'UPI / Cash on Delivery',
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    deliveryTimeline: [
      { step: 'Order Placed', time: 'Yesterday 10:30 AM', done: true },
      { step: 'Packed at Farm', time: 'Yesterday 04:00 PM', done: true },
      { step: 'Out for Delivery', time: 'Today 08:30 AM', done: true },
      { step: 'Delivered to Door', time: 'Expected Today 03:00 PM', done: false }
    ]
  },
  {
    id: 'ord_1002',
    productId: 'prod_2',
    productName: 'Farm Fresh Country Tomatoes',
    productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    sellerId: 'farmer_102',
    sellerName: 'Ramesh Kumar (Farmer)',
    sellerRole: 'FARMER',
    customerId: 'cust_301',
    customerName: 'Ananya Sharma',
    customerPhone: '9840123456',
    deliveryAddress: 'Plot 42, Anna Nagar West, Chennai, Tamil Nadu',
    quantity: 1,
    unit: 'Crate (15kg)',
    totalPrice: 380,
    status: 'Packed at Farm',
    paymentMethod: 'UPI Online',
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    deliveryTimeline: [
      { step: 'Order Placed', time: 'Today 07:00 AM', done: true },
      { step: 'Packed at Farm', time: 'Today 10:15 AM', done: true },
      { step: 'Out for Delivery', time: 'Scheduled Tomorrow', done: false },
      { step: 'Delivered to Door', time: 'Expected Tomorrow 11:00 AM', done: false }
    ]
  }
];

const getLocalOrders = () => {
  const stored = localStorage.getItem('agrimind_orders');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // Fallback
    }
  }
  localStorage.setItem('agrimind_orders', JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

const saveLocalOrders = (orders) => {
  localStorage.setItem('agrimind_orders', JSON.stringify(orders));
};

export const orderService = {
  /**
   * GET /api/orders
   */
  async getOrders(params = {}) {
    try {
      const response = await api.get('/orders', { params });
      return response;
    } catch (err) {
      let orders = getLocalOrders();

      if (params.customerId) {
        orders = orders.filter((o) => o.customerId === params.customerId);
      }
      if (params.sellerId) {
        orders = orders.filter((o) => o.sellerId === params.sellerId);
      }
      if (params.status) {
        orders = orders.filter((o) => o.status === params.status);
      }

      return { orders, total: orders.length };
    }
  },

  /**
   * GET /api/orders/:id
   */
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.order || response;
    } catch (err) {
      const orders = getLocalOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
  },

  /**
   * POST /api/orders
   */
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (err) {
      const orders = getLocalOrders();
      const newOrder = {
        id: 'ord_' + Math.floor(Math.random() * 90000 + 10000),
        status: 'Order Placed',
        paymentStatus: 'Paid',
        createdAt: new Date().toISOString(),
        deliveryTimeline: [
          { step: 'Order Placed', time: 'Just now', done: true },
          { step: 'Packed at Farm', time: 'Pending', done: false },
          { step: 'Out for Delivery', time: 'Pending', done: false },
          { step: 'Delivered to Door', time: 'Pending', done: false }
        ],
        ...orderData
      };
      const updated = [newOrder, ...orders];
      saveLocalOrders(updated);

      // Clear cart
      localStorage.removeItem('agrimind_cart');

      return { success: true, order: newOrder, message: 'Order placed directly with seller!' };
    }
  },

  /**
   * PUT /api/orders/:id/status
   */
  async updateOrderStatus(id, status) {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response;
    } catch (err) {
      const orders = getLocalOrders();
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) throw new Error('Order not found');

      orders[index].status = status;
      orders[index].updatedAt = new Date().toISOString();
      saveLocalOrders(orders);
      return { success: true, order: orders[index], message: `Order status updated to ${status}` };
    }
  },

  // Cart Local Storage Helper
  getCart() {
    try {
      return JSON.parse(localStorage.getItem('agrimind_cart') || '[]');
    } catch (e) {
      return [];
    }
  },

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    localStorage.setItem('agrimind_cart', JSON.stringify(cart));
    return cart;
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter((item) => item.product.id !== productId);
    localStorage.setItem('agrimind_cart', JSON.stringify(cart));
    return cart;
  },

  updateCartQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    localStorage.setItem('agrimind_cart', JSON.stringify(cart));
    return cart;
  },

  clearCart() {
    localStorage.removeItem('agrimind_cart');
    return [];
  },

  // Wishlist Local Storage Helper
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('agrimind_wishlist') || '[]');
    } catch (e) {
      return [];
    }
  },

  toggleWishlist(product) {
    let wishlist = this.getWishlist();
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      wishlist = wishlist.filter((p) => p.id !== product.id);
    } else {
      wishlist.push(product);
    }
    localStorage.setItem('agrimind_wishlist', JSON.stringify(wishlist));
    return { inWishlist: !exists, wishlist };
  }
};
