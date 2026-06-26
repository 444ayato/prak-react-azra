-- ================================================================
-- SUPABASE COMPLETE MIGRATION
-- Project: Sedap Admin Dashboard
-- ================================================================
-- Copy seluruh isi file ini, paste ke Supabase SQL Editor, lalu RUN.
-- Menjalankan semuanya: Create Tables → Trigger → RLS → Loyalty
-- ================================================================

-- ================================================================
-- BAGIAN 1: CREATE TABLES
-- ================================================================

-- Enable UUID extension (jika belum aktif)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLE: profiles (Menyimpan data profil user)
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

-- TABLE: products (Menyimpan data produk/menu)
CREATE TABLE IF NOT EXISTS products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    description TEXT,
    price       NUMERIC NOT NULL CHECK (price > 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLE: orders (Menyimpan data pesanan)
CREATE TABLE IF NOT EXISTS orders (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLE: order_items (Menyimpan item-item dalam suatu pesanan)
CREATE TABLE IF NOT EXISTS order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time NUMERIC NOT NULL CHECK (price_at_time >= 0)
);

-- INDEXES (optimasi query)
CREATE INDEX IF NOT EXISTS idx_orders_profile_id ON orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);


-- ================================================================
-- BAGIAN 2: TRIGGER - AUTO CREATE PROFILES SAAT REGISTER
-- ================================================================

-- Function: handle_new_user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'member'
  );
  RETURN NEW;
END;
$$;

-- Trigger: on_auth_user_created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ================================================================
-- BAGIAN 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS pada semua tabel
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ===== PROFILES =====
-- Admin: SELECT semua
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Member/Guest: SELECT sendiri
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());
-- Member: UPDATE sendiri
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
-- Admin: UPDATE semua
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Admin: DELETE semua
CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===== PRODUCTS =====
-- Semua user: SELECT semua
CREATE POLICY "products_select_all" ON products
  FOR SELECT USING (true);
-- Admin: INSERT
CREATE POLICY "products_insert_admin" ON products
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Admin: UPDATE
CREATE POLICY "products_update_admin" ON products
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Admin: DELETE
CREATE POLICY "products_delete_admin" ON products
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===== ORDERS =====
-- Admin: SELECT semua
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Member: SELECT sendiri
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (profile_id = auth.uid());
-- Member: INSERT sendiri
CREATE POLICY "orders_insert_member" ON orders
  FOR INSERT WITH CHECK (profile_id = auth.uid());
-- Admin: INSERT
CREATE POLICY "orders_insert_admin" ON orders
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Admin: UPDATE
CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Admin: DELETE
CREATE POLICY "orders_delete_admin" ON orders
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===== ORDER_ITEMS =====
-- Admin: SELECT semua
CREATE POLICY "order_items_select_admin" ON order_items
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Member: SELECT dari pesanan sendiri
CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid()));
-- Member: INSERT ke pesanan sendiri
CREATE POLICY "order_items_insert_member" ON order_items
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid()));
-- Admin: INSERT
CREATE POLICY "order_items_insert_admin" ON order_items
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Admin: UPDATE
CREATE POLICY "order_items_update_admin" ON order_items
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
-- Admin: DELETE
CREATE POLICY "order_items_delete_admin" ON order_items
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ================================================================
-- BAGIAN 4: LOYALTY SYSTEM - POINTS & TIER TRIGGER
-- ================================================================

-- Function: update_loyalty_points
CREATE OR REPLACE FUNCTION update_loyalty_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  current_points INTEGER;
  new_points INTEGER;
  new_tier TEXT;
BEGIN
  -- Hanya eksekusi jika status berubah MENJADI 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    -- Hitung poin dari total_amount (Rp 10.000 = 1 poin)
    new_points := FLOOR(NEW.total_amount / 10000)::INTEGER;

    -- Ambil poin lama & tambahkan poin baru
    UPDATE public.profiles
    SET points = points + new_points
    WHERE id = NEW.profile_id
    RETURNING points INTO current_points;

    -- Tentukan tier berdasarkan total poin
    IF current_points >= 500 THEN
      new_tier := 'Gold';
    ELSIF current_points >= 100 THEN
      new_tier := 'Silver';
    ELSE
      new_tier := 'Bronze';
    END IF;

    -- Update tier
    UPDATE public.profiles
    SET tier = new_tier
    WHERE id = NEW.profile_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger: on_order_completed
DROP TRIGGER IF EXISTS on_order_completed ON orders;
CREATE TRIGGER on_order_completed
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_loyalty_points();


-- ================================================================
-- VERIFIKASI
-- ================================================================
-- Cek tabel:   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- Cek policies: SELECT * FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
-- Cek triggers: SELECT trigger_name, event_manipulation FROM information_schema.triggers WHERE trigger_schema = 'public';


-- ================================================================
-- MEMBUAT ADMIN USER (Jalankan SETELAH register user via app)
-- ================================================================
-- Ganti '<UUID_DARI_USER>' dengan ID user dari tabel profiles:
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE id = '<UUID_DARI_USER>';
-- ================================================================
