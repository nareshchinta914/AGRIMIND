const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const { productSchema, productUpdateSchema } = require('../validators/productValidator');

class ProductController {
  /**
   * GET /api/products
   */
  async getProducts(req, res, next) {
    try {
      const { category, sellerRole, search, page = 1, limit = 12 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where = {
        available: true,
        ...(category && category !== 'All' && { category }),
        ...(sellerRole && sellerRole !== 'All' && { sellerRole }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            seller: {
              select: {
                id: true,
                fullName: true,
                mobileNumber: true,
                role: true,
                farmerProfile: true,
                merchantProfile: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take
        }),
        prisma.product.count({ where })
      ]);

      const formatted = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        unit: p.unit,
        price: p.price,
        location: p.location,
        description: p.description,
        image: p.imageUrl,
        available: p.available,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        sellerId: p.sellerId,
        sellerName: p.seller?.merchantProfile?.businessName || p.seller?.fullName || 'Verified Seller',
        sellerRole: p.sellerRole,
        sellerLocation: p.seller?.district || p.location,
        sellerPhone: p.seller?.mobileNumber
      }));

      return successResponse(
        res,
        {
          products: formatted,
          total,
          page: Number(page),
          totalPages: Math.ceil(total / take)
        },
        'Products retrieved'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   */
  async getProductById(req, res, next) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          seller: {
            select: {
              id: true,
              fullName: true,
              mobileNumber: true,
              role: true,
              farmerProfile: true,
              merchantProfile: true
            }
          }
        }
      });

      if (!product) return errorResponse(res, 'Product not found', 'NOT_FOUND', 404);

      const formatted = {
        id: product.id,
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        price: product.price,
        location: product.location,
        description: product.description,
        image: product.imageUrl,
        available: product.available,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        sellerId: product.sellerId,
        sellerName: product.seller?.merchantProfile?.businessName || product.seller?.fullName || 'Verified Seller',
        sellerRole: product.sellerRole,
        sellerLocation: product.seller?.district || product.location,
        sellerPhone: product.seller?.mobileNumber
      };

      return successResponse(res, { product: formatted }, 'Product details retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products (Requires FARMER or MERCHANT role)
   */
  async createProduct(req, res, next) {
    try {
      const data = productSchema.parse(req.body);
      const sellerId = Number(req.user?.id) || 1;

      const product = await prisma.product.create({
        data: {
          sellerId,
          sellerRole: req.user?.role || 'FARMER',
          name: data.name,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit,
          price: data.price,
          location: data.location,
          description: data.description || '',
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
          available: true
        }
      });

      return successResponse(res, { product }, 'Product listed successfully on marketplace', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const data = productUpdateSchema.parse(req.body);
      const productId = Number(req.params.id);
      const sellerId = Number(req.user?.id) || 1;

      const product = await prisma.product.findFirst({
        where: { id: productId, sellerId }
      });

      if (!product && req.user?.role !== 'ADMIN') {
        return errorResponse(res, 'Product not found or unauthorized to edit', 'FORBIDDEN', 403);
      }

      const updated = await prisma.product.update({
        where: { id: productId },
        data
      });

      return successResponse(res, { product: updated }, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/products/:id
   */
  async deleteProduct(req, res, next) {
    try {
      const productId = Number(req.params.id);
      const sellerId = Number(req.user?.id) || 1;
      const product = await prisma.product.findFirst({
        where: { id: productId, sellerId }
      });

      if (!product && req.user?.role !== 'ADMIN') {
        return errorResponse(res, 'Product not found or unauthorized to delete', 'FORBIDDEN', 403);
      }

      await prisma.product.delete({
        where: { id: productId }
      });

      return successResponse(res, {}, 'Product removed from marketplace');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products/:id/wishlist
   */
  async toggleWishlist(req, res, next) {
    try {
      const productId = Number(req.params.id);
      const userId = Number(req.user?.id) || 1;

      const existing = await prisma.wishlist.findUnique({
        where: {
          userId_productId: { userId, productId }
        }
      });

      if (existing) {
        await prisma.wishlist.delete({
          where: { id: existing.id }
        });
        return successResponse(res, { inWishlist: false }, 'Removed from wishlist');
      } else {
        await prisma.wishlist.create({
          data: { userId, productId }
        });
        return successResponse(res, { inWishlist: true }, 'Saved to wishlist');
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
