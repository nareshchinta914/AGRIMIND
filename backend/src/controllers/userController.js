const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

class UserController {
  /**
   * GET /api/users/profile
   */
  async getProfile(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          farmerProfile: true,
          customerProfile: true,
          merchantProfile: true
        }
      });

      if (!user) {
        return errorResponse(res, 'User not found', 'NOT_FOUND', 404);
      }

      const { passwordHash, ...safeUser } = user;
      return successResponse(res, { profile: safeUser }, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/profile
   */
  async updateProfile(req, res, next) {
    try {
      const userId = Number(req.user?.id) || 1;
      const {
        fullName,
        email,
        preferredLanguage,
        state,
        district,
        // Role profile updates
        village,
        farmSize,
        farmSizeUnit,
        soilType,
        currentCrops,
        deliveryAddress,
        businessName,
        businessType,
        businessAddress,
        gstNumber
      } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(fullName && { fullName }),
          ...(email !== undefined && { email }),
          ...(preferredLanguage && { preferredLanguage }),
          ...(state && { state }),
          ...(district && { district }),
          // Update farmer profile
          ...(req.user.role === 'FARMER' && {
            farmerProfile: {
              upsert: {
                create: {
                  village,
                  farmSize: farmSize ? Number(farmSize) : 5.0,
                  farmSizeUnit: farmSizeUnit || 'Acres',
                  soilType: soilType || 'alluvial',
                  currentCrops: currentCrops || 'Paddy'
                },
                update: {
                  ...(village !== undefined && { village }),
                  ...(farmSize !== undefined && { farmSize: Number(farmSize) }),
                  ...(farmSizeUnit !== undefined && { farmSizeUnit }),
                  ...(soilType !== undefined && { soilType }),
                  ...(currentCrops !== undefined && { currentCrops })
                }
              }
            }
          }),
          // Update customer profile
          ...(req.user.role === 'CUSTOMER' && {
            customerProfile: {
              upsert: {
                create: { deliveryAddress: deliveryAddress || '' },
                update: { ...(deliveryAddress !== undefined && { deliveryAddress }) }
              }
            }
          }),
          // Update merchant profile
          ...(req.user.role === 'MERCHANT' && {
            merchantProfile: {
              upsert: {
                create: {
                  businessName: businessName || '',
                  businessType: businessType || 'Wholesaler',
                  businessAddress: businessAddress || '',
                  gstNumber: gstNumber || null
                },
                update: {
                  ...(businessName !== undefined && { businessName }),
                  ...(businessType !== undefined && { businessType }),
                  ...(businessAddress !== undefined && { businessAddress }),
                  ...(gstNumber !== undefined && { gstNumber })
                }
              }
            }
          })
        },
        include: {
          farmerProfile: true,
          customerProfile: true,
          merchantProfile: true
        }
      });

      const { passwordHash, ...safeUser } = updatedUser;
      return successResponse(res, { profile: safeUser }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
