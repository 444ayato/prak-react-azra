-- ============================================================
-- MIGRATION 001: Create Tables
-- ============================================================
-- Jalankan script ini di Supabase SQL Editor secara berurutan.
-- ============================================================

-- 0. Enable UUID extension (jika belum aktif)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: profiles
-- Menyimpan data profil user (berelasi dengan auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    role        TEXT NOT NULL DEFAULT 'member' 
                CHECK (role IN ('admin', 'member', 'guest')),
    points      INTEGER NOT NULL DEFAULT 0 
                CHECK (points >= 0),
    tier        TEXT NOT NULL DEFAULT 'Bronze' 
                CHECK (tier IN ('Bronze', 'Silver', 'Gold')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: products
-- Menyimpan data produk/menu
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    description TEXT,
    price       NUMERIC NOT NULL CHECK (price > 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: orders
-- Menyimpan data pesanan
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: order_items
-- Menyimpan item-item dalam suatu pesanan
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time NUMERIC NOT NULL CHECK (price_at_time >= 0)
);

-- ============================================================
-- INDEXES: untuk optimasi query
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_profile_id ON orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================
-- COMMENTS: dokumentasi tabel & kolom
-- ============================================================
COMMENT ON TABLE profiles IS 'Data profil user, berelasi 1-to-1 dengan auth.users';
COMMENT ON COLUMN profiles.role IS 'Role: admin, member, atau guest';
COMMENT ON COLUMN profiles.points IS 'Akumulasi poin loyalitas member';
COMMENT ON COLUMN profiles.tier IS 'Tier member: Bronze (<100), Silver (100-499), Gold (>=500)';

COMMENT ON TABLE products IS 'Daftar produk/menu yang tersedia';
COMMENT ON TABLE orders IS 'Pesanan yang dibuat oleh member';
COMMENT ON TABLE order_items IS 'Item-item dalam setiap pesanan';
