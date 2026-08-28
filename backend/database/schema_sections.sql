-- ==============================================================================
-- 🌾 AGRIMIND AGRICULTURAL INTELLIGENCE PLATFORM
-- 🗄️ COMPLETE MODULAR DATABASE SCHEMA (POSTGRESQL / MYSQL COMPATIBLE)
-- ==============================================================================
-- SECTIONS INCLUDED:
--   1. REGISTRATION & USER ACCOUNT MANAGEMENT SECTION
--   2. MARKETING & MARKETPLACE SECTION
--   3. CUSTOMER CART & ORDERS SECTION
--   4. CROP OPERATIONS & FARM MANAGEMENT SECTION
--   5. MERCHANT & B2B TRADING SECTION
-- ==============================================================================

-- Create Extensions if PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 👤 SECTION 1: REGISTRATION & USER ACCOUNT MANAGEMENT SECTION
-- ==============================================================================

-- 1.1 Core Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(64) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'FARMER' CHECK (role IN ('FARMER', 'CUSTOMER', 'MERCHANT', 'ADMIN')),
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 1.2 User Authentication Sessions & Refresh Tokens
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);

-- 1.3 Password Reset & OTP Verification
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mobile_or_email VARCHAR(150) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    reset_token VARCHAR(255) UNIQUE,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(reset_token);

-- ==============================================================================
-- 🛒 SECTION 2: MARKETING & MARKETPLACE SECTION
-- ==============================================================================

-- 2.1 Product Categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Sprout',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 Marketplace Products & Farmer Listings
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(64) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_role VARCHAR(20) NOT NULL DEFAULT 'FARMER',
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Cereals & Grains',
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    unit VARCHAR(30) NOT NULL DEFAULT 'Quintals',
    price NUMERIC(10, 2) NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 4.80,
    reviews_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);

-- 2.3 Product Reviews & Ratings
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.4 Live APMC Mandi Market Prices
CREATE TABLE IF NOT EXISTS mandi_market_rates (
    id SERIAL PRIMARY KEY,
    mandi_name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    price_unit VARCHAR(30) NOT NULL DEFAULT '₹ / Quintal',
    price_trend VARCHAR(20) DEFAULT 'STABLE' CHECK (price_trend IN ('UP', 'DOWN', 'STABLE')),
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_mandi_crop ON mandi_market_rates(crop_name);
CREATE INDEX IF NOT EXISTS idx_mandi_district ON mandi_market_rates(district);

-- ==============================================================================
-- 🛍️ SECTION 3: CUSTOMER CART & ORDERS SECTION
-- ==============================================================================

-- 3.1 Customer Shopping Cart
CREATE TABLE IF NOT EXISTS customer_carts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3.2 Items inside Customer Cart
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES customer_carts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    unit_price NUMERIC(10, 2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- 3.3 Customer Wishlist
CREATE TABLE IF NOT EXISTS customer_wishlists (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, product_id)
);

-- 3.4 Customer Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_price NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'UPI / Online Payment',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100),
    pincode VARCHAR(20),
    timeline_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 3.5 Items in Customer Order
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'Quintals',
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ==============================================================================
-- 🌾 SECTION 4: CROP OPERATIONS & FARM MANAGEMENT SECTION
-- ==============================================================================

-- 4.1 Farmer Extended Profile
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    village VARCHAR(100),
    farm_size NUMERIC(8, 2) NOT NULL DEFAULT 5.00,
    farm_size_unit VARCHAR(20) NOT NULL DEFAULT 'Acres',
    soil_type VARCHAR(100) NOT NULL DEFAULT 'alluvial',
    current_crops VARCHAR(200) NOT NULL DEFAULT 'Paddy',
    pm_kisan_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.2 Farmer Plots & Landholdings
CREATE TABLE IF NOT EXISTS farms (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(150) NOT NULL,
    location VARCHAR(200) NOT NULL,
    total_area NUMERIC(8, 2) NOT NULL,
    soil_type VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_farms_farmer ON farms(farmer_id);

-- 4.3 Crop Master Catalog
CREATE TABLE IF NOT EXISTS crops_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    scientific_name VARCHAR(150),
    category VARCHAR(100) NOT NULL DEFAULT 'Cereals & Grains',
    suitable_soil VARCHAR(200) NOT NULL,
    water_requirement VARCHAR(50) DEFAULT 'Moderate',
    sowing_season VARCHAR(100) NOT NULL,
    duration_days INTEGER DEFAULT 120,
    expected_yield VARCHAR(100),
    fertilizer_recipe TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.4 AI Crop Health & Recommendations
CREATE TABLE IF NOT EXISTS crop_recommendations (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_id INTEGER REFERENCES farms(id) ON DELETE SET NULL,
    soil_type VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    recommended_crop VARCHAR(100) NOT NULL,
    confidence_score NUMERIC(4, 3) DEFAULT 0.950,
    npk_recommendation TEXT,
    yield_forecast VARCHAR(100),
    profit_forecast VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.5 Smart Water Advisory & Irrigation Timers
CREATE TABLE IF NOT EXISTS water_advisories (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    farm_size NUMERIC(8, 2) NOT NULL,
    soil_type VARCHAR(100) NOT NULL,
    soil_moisture VARCHAR(100) DEFAULT '34% Adequate',
    next_irrigation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    water_saving_tip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.6 Weather Records & Hyper-Local Radar
CREATE TABLE IF NOT EXISTS weather_records (
    id SERIAL PRIMARY KEY,
    location VARCHAR(150) NOT NULL,
    temperature NUMERIC(5, 2) NOT NULL,
    humidity NUMERIC(5, 2) NOT NULL,
    rainfall_probability NUMERIC(5, 2) DEFAULT 0.00,
    wind_speed NUMERIC(5, 2) DEFAULT 10.00,
    condition VARCHAR(100) DEFAULT 'Clear',
    spray_advisory TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.7 Farm Financials & Crop Cost Estimations
CREATE TABLE IF NOT EXISTS farm_costs (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    total_cost NUMERIC(12, 2) NOT NULL,
    cost_per_acre NUMERIC(10, 2) NOT NULL,
    expected_revenue NUMERIC(12, 2) NOT NULL,
    estimated_profit NUMERIC(12, 2) NOT NULL,
    break_even_yield VARCHAR(100),
    breakdown_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.8 Farm Operations & Task Calendar
CREATE TABLE IF NOT EXISTS farm_activities (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    activity_type VARCHAR(50) NOT NULL DEFAULT 'IRRIGATION' CHECK (activity_type IN ('SOWING', 'FERTILIZER', 'IRRIGATION', 'PESTICIDE', 'HARVEST', 'OTHER')),
    plot_name VARCHAR(100) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED')),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.9 AI Conversation Logs
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    language VARCHAR(10) DEFAULT 'en',
    message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 🏢 SECTION 5: MERCHANT & B2B TRADING SECTION
-- ==============================================================================

-- 5.1 Merchant Extended Business Profile
CREATE TABLE IF NOT EXISTS merchant_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(200) NOT NULL,
    business_type VARCHAR(100) NOT NULL DEFAULT 'Wholesaler & Miller',
    business_address TEXT NOT NULL,
    gst_number VARCHAR(50),
    apmc_license VARCHAR(50),
    storage_capacity_quintals NUMERIC(12, 2) DEFAULT 5000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5.2 Merchant Live Purchasing Bids (Bulk Procurement)
CREATE TABLE IF NOT EXISTS merchant_bids (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    required_quantity NUMERIC(12, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'Quintals',
    offered_price_per_unit NUMERIC(10, 2) NOT NULL,
    max_acceptable_moisture NUMERIC(4, 2) DEFAULT 17.00,
    delivery_location VARCHAR(200) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_NEGOTIATION', 'FULFILLED', 'CLOSED')),
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_merchant_bids_crop ON merchant_bids(crop_name);
CREATE INDEX IF NOT EXISTS idx_merchant_bids_status ON merchant_bids(status);

-- 5.3 Farmer Bid Offers / Responses
CREATE TABLE IF NOT EXISTS farmer_bid_responses (
    id SERIAL PRIMARY KEY,
    bid_id INTEGER NOT NULL REFERENCES merchant_bids(id) ON DELETE CASCADE,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offered_quantity NUMERIC(10, 2) NOT NULL,
    proposed_price_per_unit NUMERIC(10, 2) NOT NULL,
    sample_photos_json JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5.4 Procurement Contracts & Invoices
CREATE TABLE IF NOT EXISTS procurement_contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(64) UNIQUE NOT NULL,
    merchant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bid_id INTEGER REFERENCES merchant_bids(id) ON DELETE SET NULL,
    crop_name VARCHAR(100) NOT NULL,
    agreed_quantity NUMERIC(12, 2) NOT NULL,
    agreed_price_per_unit NUMERIC(10, 2) NOT NULL,
    total_contract_value NUMERIC(14, 2) NOT NULL,
    payment_terms VARCHAR(100) DEFAULT '50% Advance on Loading, 50% on APMC Weighbridge Verification',
    delivery_status VARCHAR(30) DEFAULT 'PROCESSING' CHECK (delivery_status IN ('PROCESSING', 'DISPATCHED', 'WEIGHED_AND_VERIFIED', 'COMPLETED', 'DISPUTED')),
    contract_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 🌱 SAMPLE SEED DATA
-- ==============================================================================

-- Seed Categories
INSERT INTO categories (name, slug, description, icon_name) VALUES
('Cereals & Grains', 'cereals-grains', 'Paddy, Wheat, Maize, Millets', 'Wheat'),
('Pulses & Lentils', 'pulses-lentils', 'Toor Dal, Moong Dal, Urad Dal', 'Layers'),
('Oilseeds', 'oilseeds', 'Groundnut, Mustard, Sesame', 'Droplet'),
('Spices & Condiments', 'spices', 'Turmeric, Chilli, Coriander', 'Flame')
ON CONFLICT (name) DO NOTHING;

-- Seed Crops Master
INSERT INTO crops_master (name, scientific_name, category, suitable_soil, water_requirement, sowing_season, duration_days, expected_yield) VALUES
('Paddy (Rice)', 'Oryza sativa', 'Cereals & Grains', 'Alluvial, Clayey Loam', 'High (1200-1400mm)', 'Kharif / Samba', 135, '25-30 Quintals/Acre'),
('Wheat', 'Triticum aestivum', 'Cereals & Grains', 'Alluvial, Loamy', 'Moderate (450-650mm)', 'Rabi (Winter)', 120, '20-25 Quintals/Acre'),
('Cotton', 'Gossypium hirsutum', 'Cash Crops', 'Black Cotton Soil', 'Moderate (700-1000mm)', 'Kharif (Monsoon)', 160, '12-15 Quintals/Acre'),
('Groundnut', 'Arachis hypogaea', 'Oilseeds', 'Red Sandy Loam', 'Low to Moderate', 'Kharif / Zaid', 110, '10-14 Quintals/Acre')
ON CONFLICT (name) DO NOTHING;
