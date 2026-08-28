import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('agrimind_access_token') || localStorage.getItem('agrimind_token') || null
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('agrimind_user');
        const token = localStorage.getItem('agrimind_access_token') || localStorage.getItem('agrimind_token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        } else if (token) {
          const profile = await authService.getProfile();
          setUser(profile);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [accessToken]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response?.user) {
      setUser(response.user);
      setAccessToken(response.accessToken || localStorage.getItem('agrimind_access_token'));
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response?.user) {
      setUser(response.user);
      setAccessToken(response.accessToken || localStorage.getItem('agrimind_access_token'));
    }
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setAccessToken(null);
  };

  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    if (response?.user) {
      setUser(response.user);
    }
    return response;
  };

  // Helper to determine dashboard redirect based on role
  const getDashboardPath = (role = user?.role) => {
    const r = (role || 'FARMER').toUpperCase();
    if (r === 'MERCHANT') return '/merchant/dashboard';
    if (r === 'CUSTOMER') return '/customer/dashboard';
    return '/farmer/dashboard';
  };

  // 1-Click Role Switcher for instant testing and cross-role operations
  const switchRole = (newRole) => {
    const roleUpper = (newRole || 'FARMER').toUpperCase();
    let updatedUser = user ? { ...user, role: roleUpper } : {
      id: `${roleUpper.toLowerCase()}_demo_${Date.now()}`,
      role: roleUpper,
      preferredLanguage: 'en',
      state: 'Tamil Nadu',
      district: 'Thanjavur'
    };

    if (roleUpper === 'FARMER') {
      updatedUser.name = updatedUser.name?.includes('(') ? 'Naresh Chinta (Farmer)' : (updatedUser.name || 'Naresh Chinta');
      updatedUser.farmSize = updatedUser.farmSize || 5.5;
      updatedUser.farmSizeUnit = updatedUser.farmSizeUnit || 'Acres';
      updatedUser.soilType = updatedUser.soilType || 'alluvial';
      updatedUser.currentCrop = updatedUser.currentCrop || 'Paddy (Ponni & BPT-5204)';
      updatedUser.village = updatedUser.village || 'Papanasam';
    } else if (roleUpper === 'CUSTOMER') {
      updatedUser.name = updatedUser.name?.includes('(') ? 'Ananya Sharma (Customer)' : (updatedUser.name || 'Ananya Sharma');
      updatedUser.deliveryAddress = updatedUser.deliveryAddress || 'Plot 42, Anna Nagar West, Chennai';
      updatedUser.favoriteProducts = updatedUser.favoriteProducts || ['Organic Ponni Rice', 'Country Tomatoes', 'Cold-pressed Sesame Oil'];
    } else if (roleUpper === 'MERCHANT') {
      updatedUser.name = updatedUser.name?.includes('(') ? 'Rajesh Kumar (Merchant)' : (updatedUser.name || 'Rajesh Kumar');
      updatedUser.businessName = updatedUser.businessName || 'Sri Lakshmi Modern Rice Mill & Agro Traders';
      updatedUser.businessType = updatedUser.businessType || 'Miller & Grain Wholesaler';
      updatedUser.businessAddress = updatedUser.businessAddress || 'Plot 12, APMC Mandi Yard, Thanjavur';
      updatedUser.gstNumber = updatedUser.gstNumber || '33AAAAA0000A1Z5';
    }

    const token = accessToken || 'jwt_demo_token_' + Date.now();
    localStorage.setItem('agrimind_user', JSON.stringify(updatedUser));
    localStorage.setItem('agrimind_access_token', token);
    setUser(updatedUser);
    setAccessToken(token);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ? user.role.toUpperCase() : null,
        accessToken,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
