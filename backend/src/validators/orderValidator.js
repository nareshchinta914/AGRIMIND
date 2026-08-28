const { z } = require('zod');

const orderCreateSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().positive(),
  deliveryAddress: z.string().min(5, 'Valid delivery address is required'),
  paymentMethod: z.string().default('UPI / COD')
});

const orderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  note: z.string().optional()
});

module.exports = {
  orderCreateSchema,
  orderStatusUpdateSchema
};
