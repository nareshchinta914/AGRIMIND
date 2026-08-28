-- AGRIMIND Database Schema for Image Analysis Records & Farmer History
-- Database: PostgreSQL

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'ta',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) DEFAULT 'Main Farm',
    acres NUMERIC(8, 2) DEFAULT 1.0,
    soil_type VARCHAR(100) DEFAULT 'alluvial',
    primary_crop VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Requirement 25: image_analysis_records
CREATE TABLE IF NOT EXISTS image_analysis_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    farm_id INTEGER REFERENCES farms(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    analysis_type VARCHAR(50) DEFAULT 'crop_disease', -- 'crop_disease', 'pest', 'nutrient_deficiency'
    crop_identified VARCHAR(100) NOT NULL,
    prediction TEXT NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    recommendation TEXT NOT NULL,
    water_advice TEXT,
    language VARCHAR(10) DEFAULT 'ta',
    voice_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast farmer history lookup
CREATE INDEX IF NOT EXISTS idx_image_analysis_user_id ON image_analysis_records(user_id);
CREATE INDEX IF NOT EXISTS idx_image_analysis_created_at ON image_analysis_records(created_at DESC);
