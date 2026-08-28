const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const { orderCreateSchema, orderStatusUpdateSchema } = require('../validators/orderValidator');

class OrderController {
  /**
   * GET /api/orders
   */
  async getOrders(req, res, next) {
    try {
      const user = req.user;
      const userId = Number(user?.id) || 1;
      let whereClause = {};

      if (user?.role === 'CUSTOMER') {
        whereClause = { customerId: userId };
      } else if (user?.role === 'FARMER' || user?.role === 'MERCHANT') {
        whereClause = { sellerId: userId };
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          orderItems: true,
          seller: {
            select: {
              fullName: true,
              mobileNumber: true,
              role: true,
              merchantProfile: true
            }
          },
          customer: {
            select: {
              fullName: true,
              mobileNumber: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const formatted = orders.map((o) => {
        let timeline = [];
        try {
          timeline = o.timelineJson ? JSON.parse(o.timelineJson) : [];
        } catch {
          timeline = [];
        }

        return {
          id: o.id,
          orderNumber: o.orderNumber,
          productName: o.orderItems[0]?.productName || 'Agricultural Produce',
          productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
          sellerName: o.seller?.merchantProfile?.businessName || o.seller?.fullName || 'Harvest Farm',
          sellerRole: o.seller?.role,
          customerName: o.customer?.fullName,
          customerPhone: o.customer?.mobileNumber,
          deliveryAddress: o.deliveryAddress,
          quantity: o.orderItems[0]?.quantity || 1,
          unit: o.orderItems[0]?.unit || 'Bags',
          totalPrice: o.totalPrice,
          status: o.status,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
          timeline
        };
      });

      return successResponse(res, { orders: formatted }, 'Orders retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/:id
   */
  async getOrderById(req, res, next) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          orderItems: true,
          seller: true,
          customer: true
        }
      });

      if (!order) return errorResponse(res, 'Order not found', 'NOT_FOUND', 404);

      return successResponse(res, { order }, 'Order retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/orders
   */
  async createOrder(req, res, next) {
    try {
      const data = orderCreateSchema.parse(req.body);

      const product = await prisma.product.findUnique({
        where: { id: data.productId }
      });

      if (!product) return errorResponse(res, 'Product not found', 'NOT_FOUND', 404);
      if (product.quantity < data.quantity) {
        return errorResponse(res, 'Requested quantity exceeds available stock', 'INSUFFICIENT_STOCK', 400);
      }

      const totalPrice = product.price * data.quantity;

      const defaultTimeline = [
        { step: 'Order Placed', time: 'Just now', done: true },
        { step: 'Packed at Farm', time: 'Pending', done: false },
        { step: 'Out for Delivery', time: 'Pending', done: false },
        { step: 'Delivered', time: 'Pending', done: false }
      ];

      // Create order & deduct stock in a single transaction
      const customerId = Number(req.user?.id) || 1;
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            customerId,
            sellerId: product.sellerId,
            totalPrice,
            status: 'PENDING',
            paymentMethod: data.paymentMethod,
            deliveryAddress: data.deliveryAddress,
            timelineJson: JSON.stringify(defaultTimeline),
            orderItems: {
              create: {
                productId: product.id,
                productName: product.name,
                quantity: data.quantity,
                unit: product.unit,
                unitPrice: product.price,
                totalPrice
              }
            }
          },
          include: { orderItems: true }
        });

        await tx.product.update({
          where: { id: product.id },
          data: { quantity: { decrement: data.quantity } }
        });

        return newOrder;
      });

      return successResponse(res, { order }, 'Order placed successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/orders/:id/status
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { status } = orderStatusUpdateSchema.parse(req.body);
      const orderId = Number(req.params.id);

      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) return errorResponse(res, 'Order not found', 'NOT_FOUND', 404);

      // Build updated timeline
      const timeline = [
        { step: 'Order Placed', time: 'Completed', done: true },
        { step: 'Packed at Farm', time: status === 'CONFIRMED' || status === 'PROCESSING' || status === 'SHIPPED' || status === 'DELIVERED' ? 'Completed' : 'Pending', done: status !== 'PENDING' },
        { step: 'Out for Delivery', time: status === 'SHIPPED' || status === 'DELIVERED' ? 'In Transit' : 'Pending', done: status === 'SHIPPED' || status === 'DELIVERED' },
        { step: 'Delivered', time: status === 'DELIVERED' ? 'Delivered' : 'Pending', done: status === 'DELIVERED' }
      ];

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          timelineJson: JSON.stringify(timeline),
          ...(status === 'DELIVERED' && { paymentStatus: 'PAID' })
        }
      });

      return successResponse(res, { order: updated }, `Order status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
