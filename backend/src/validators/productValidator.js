const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().default('Cereals & Grains'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit of measurement is required'),
  price: z.number().positive('Price must be greater than 0'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Valid image URL required').optional().or(z.literal(''))
});

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  price: z.number().positive().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  available: z.boolean().optional()
});

module.exports = {
  productSchema,
  productUpdateSchema
};
