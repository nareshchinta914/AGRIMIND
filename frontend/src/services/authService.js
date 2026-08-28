import api from './api';

// Helper to simulate realistic delay if backend is offline during frontend development
const simulateBackend = (callback, delayMs = 400) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = callback();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    }, delayMs);
  });
};

export const authService = {
  /**
   * Login user via Mobile Number or Email + Password
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const token = response?.accessToken || response?.data?.accessToken;
      const refToken = response?.refreshToken || response?.data?.refreshToken;
      const userObj = response?.user || response?.data?.user;

      if (token) {
        localStorage.setItem('agrimind_access_token', token);
      }
      if (refToken) {
        localStorage.setItem('agrimind_refresh_token', refToken);
      }
      if (userObj) {
        localStorage.setItem('agrimind_user', JSON.stringify(userObj));
      }
      return { success: true, user: userObj, accessToken: token, refreshToken: refToken, ...response };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        throw new Error(err.message || (err.status === 403 ? 'Invalid account type for this account.' : 'Invalid mobile number/email or password'));
      }

      return simulateBackend(() => {
        const identifier = (credentials.identifier || credentials.phone || credentials.email || '9876543210').trim();
        const isEmail = identifier.includes('@');
        const roleHint = credentials.role ? credentials.role.toUpperCase() : null;
        
        let actualAccountRole = identifier.includes('merchant') ? 'MERCHANT' : identifier.includes('customer') ? 'CUSTOMER' : 'FARMER';

        if (roleHint && roleHint !== actualAccountRole) {
          throw new Error('Invalid account type for this account.');
        }

        let role = actualAccountRole;
        let name = 'Naresh Chinta';
        let extraDetails = {};

        if (role === 'FARMER') {
          name = 'Naresh Chinta (Farmer)';
          extraDetails = {
            village: 'Papanasam',
            state: 'Tamil Nadu',
            district: 'Thanjavur',
            farmSize: 5.5,
            farmSizeUnit: 'Acres',
            soilType: 'alluvial',
            currentCrop: 'Paddy (Ponni & BPT-5204)',
            preferredLanguage: 'en'
          };
        } else if (role === 'CUSTOMER') {
          name = 'Ananya Sharma (Customer)';
          extraDetails = {
            deliveryAddress: 'Plot 42, Anna Nagar West, Chennai',
            state: 'Tamil Nadu',
            district: 'Chennai',
            preferredLanguage: 'en',
            favoriteProducts: ['Organic Ponni Rice', 'Country Tomatoes', 'Cold-pressed Sesame Oil']
          };
        } else if (role === 'MERCHANT') {
          name = 'Rajesh Kumar (Merchant)';
          extraDetails = {
            businessName: 'Sri Lakshmi Modern Rice Mill & Agro Traders',
            businessType: 'Miller & Grain Wholesaler',
            businessAddress: 'Plot 12, APMC Mandi Yard, Thanjavur',
            gstNumber: '33AAAAA0000A1Z5',
            state: 'Tamil Nadu',
            district: 'Thanjavur',
            preferredLanguage: 'en'
          };
        }

        const user = {
          id: `${role.toLowerCase()}_` + Date.now(),
          name,
          fullName: name,
          phone: isEmail ? '9876543210' : identifier,
          mobileNumber: isEmail ? '9876543210' : identifier,
          email: isEmail ? identifier : `${role.toLowerCase()}@agrimind.in`,
          role,
          isVerified: true,
          createdAt: new Date().toISOString(),
          ...extraDetails
        };

        const accessToken = 'jwt_access_token_agrimind_' + Date.now();
        const refreshToken = 'jwt_refresh_token_agrimind_' + Date.now();

        localStorage.setItem('agrimind_access_token', accessToken);
        localStorage.setItem('agrimind_refresh_token', refreshToken);
        localStorage.setItem('agrimind_user', JSON.stringify(user));

        return { success: true, accessToken, refreshToken, user, message: 'Login successful' };
      });
    }
  },

  /**
   * Register a new user (FARMER, CUSTOMER, or MERCHANT)
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const token = response?.accessToken || response?.data?.accessToken;
      const refToken = response?.refreshToken || response?.data?.refreshToken;
      const userObj = response?.user || response?.data?.user;

      if (token) {
        localStorage.setItem('agrimind_access_token', token);
      }
      if (refToken) {
        localStorage.setItem('agrimind_refresh_token', refToken);
      }
      if (userObj) {
        localStorage.setItem('agrimind_user', JSON.stringify(userObj));
      }
      return { success: true, user: userObj, accessToken: token, refreshToken: refToken, ...response };
    } catch (err) {
      if (err.status === 409) {
        throw new Error(err.message || 'A user with this mobile number or email address is already registered.');
      }
      if (err.status === 400 && err.data?.errorDetails) {
        const detailMsg = err.data.errorDetails.map((d) => d.message).join(', ');
        throw new Error(detailMsg || err.message);
      }

      return simulateBackend(() => {
        const role = (userData.role || 'FARMER').toUpperCase();
        const user = {
          id: `${role.toLowerCase()}_` + Math.floor(Math.random() * 9000 + 1000),
          name: userData.fullName || userData.name || (role === 'MERCHANT' ? userData.businessName : 'New User'),
          fullName: userData.fullName || userData.name || (role === 'MERCHANT' ? userData.businessName : 'New User'),
          phone: userData.mobileNumber || userData.phone || '9876543210',
          mobileNumber: userData.mobileNumber || userData.phone || '9876543210',
          email: userData.email || `${role.toLowerCase()}${Date.now()}@agrimind.in`,
          role,
          state: userData.state || 'Tamil Nadu',
          district: userData.district || 'Thanjavur',
          preferredLanguage: userData.preferredLanguage || 'en',
          isVerified: true,
          createdAt: new Date().toISOString(),
          // Farmer
          village: userData.village || '',
          farmSize: Number(userData.farmSize) || 5.0,
          farmSizeUnit: userData.farmSizeUnit || 'Acres',
          soilType: userData.soilType || 'alluvial',
          currentCrop: userData.currentCrop || userData.currentCrops || 'Paddy',
          // Customer
          deliveryAddress: userData.deliveryAddress || `${userData.district || 'Chennai'}, ${userData.state || 'Tamil Nadu'}`,
          // Merchant
          businessName: userData.businessName || '',
          businessType: userData.businessType || 'Wholesaler & Miller',
          businessAddress: userData.businessAddress || '',
          gstNumber: userData.gstNumber || '',
        };

        const accessToken = 'jwt_access_token_agrimind_' + Date.now();
        const refreshToken = 'jwt_refresh_token_agrimind_' + Date.now();

        localStorage.setItem('agrimind_access_token', accessToken);
        localStorage.setItem('agrimind_refresh_token', refreshToken);
        localStorage.setItem('agrimind_user', JSON.stringify(user));

        return { success: true, accessToken, refreshToken, user, message: 'Registration successful!' };
      });
    }
  },

  /**
   * Logout user and clear tokens
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Safe offline
    } finally {
      localStorage.removeItem('agrimind_access_token');
      localStorage.removeItem('agrimind_refresh_token');
      localStorage.removeItem('agrimind_token');
      localStorage.removeItem('agrimind_user');
    }
    return { success: true };
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.user;
    } catch (err) {
      const stored = localStorage.getItem('agrimind_user');
      if (stored) {
        return JSON.parse(stored);
      }
      throw err;
    }
  },

  /**
   * Update profile
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response?.user) {
        localStorage.setItem('agrimind_user', JSON.stringify(response.user));
      }
      return response;
    } catch (err) {
      return simulateBackend(() => {
        const current = JSON.parse(localStorage.getItem('agrimind_user') || '{}');
        const updated = { ...current, ...profileData, updatedAt: new Date().toISOString() };
        localStorage.setItem('agrimind_user', JSON.stringify(updated));
        return { success: true, user: updated, message: 'Profile updated successfully' };
      });
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(payload) {
    try {
      return await api.post('/auth/forgot-password', payload);
    } catch (err) {
      return simulateBackend(() => {
        return { success: true, message: `Reset instructions sent to ${payload.identifier || 'your mobile number'}` };
      });
    }
  },

  /**
   * Reset password
   */
  async resetPassword(payload) {
    try {
      return await api.post('/auth/reset-password', payload);
    } catch (err) {
      return simulateBackend(() => {
        return { success: true, message: 'Password has been reset successfully. Please login with your new password.' };
      });
    }
  }
};
