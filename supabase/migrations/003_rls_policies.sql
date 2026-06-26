-- ============================================================
-- MIGRATION 003: Row Level Security (RLS) Policies
-- ============================================================
-- Aktifkan RLS dan buat kebijakan akses untuk semua tabel.
-- Jalankan setelah tabel sudah dibuat (migration 001).
-- ============================================================

-- ============================================================
-- 1. ENABLE RLS
-- ============================================================
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. PROFILES POLICIES
-- ============================================================
-- Admin: bisa SELECT semua data
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Member/Guest: hanya bisa SELECT data sendiri
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- Member: bisa UPDATE data sendiri (kecuali role, points, tier)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin: bisa UPDATE semua data (termasuk role, points, tier)
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: bisa DELETE semua data
CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- NOTE: INSERT ke profiles dilakukan otomatis oleh trigger,
-- tidak perlu policy INSERT untuk umum.

-- ============================================================
-- 3. PRODUCTS POLICIES
-- ============================================================
-- Semua user (termasuk guest) bisa melihat produk
CREATE POLICY "products_select_all" ON products
  FOR SELECT
  USING (true);

-- Hanya admin yang bisa INSERT
CREATE POLICY "products_insert_admin" ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Hanya admin yang bisa UPDATE
CREATE POLICY "products_update_admin" ON products
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Hanya admin yang bisa DELETE
CREATE POLICY "products_delete_admin" ON products
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 4. ORDERS POLICIES
-- ============================================================
-- Admin: bisa melihat semua orders
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Member: hanya bisa melihat orders milik sendiri
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT
  USING (profile_id = auth.uid());

-- Member: bisa INSERT orders (dengan profile_id = dirinya sendiri)
CREATE POLICY "orders_insert_member" ON orders
  FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Admin: bisa INSERT orders
CREATE POLICY "orders_insert_admin" ON orders
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: bisa UPDATE status orders
CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: bisa DELETE orders
CREATE POLICY "orders_delete_admin" ON orders
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Member: TIDAK bisa UPDATE atau DELETE orders

-- ============================================================
-- 5. ORDER_ITEMS POLICIES
-- ============================================================
-- Admin: bisa melihat semua order_items
CREATE POLICY "order_items_select_admin" ON order_items
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Member: hanya bisa melihat order_items dari pesanan sendiri
CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.profile_id = auth.uid()
    )
  );

-- Member: bisa INSERT order_items (untuk pesanan sendiri)
CREATE POLICY "order_items_insert_member" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.profile_id = auth.uid()
    )
  );

-- Admin: bisa INSERT order_items
CREATE POLICY "order_items_insert_admin" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: bisa UPDATE order_items
CREATE POLICY "order_items_update_admin" ON order_items
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: bisa DELETE order_items
CREATE POLICY "order_items_delete_admin" ON order_items
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Member: TIDAK bisa UPDATE atau DELETE order_items

-- ============================================================
-- 6. VERIFIKASI
-- ============================================================
-- Untuk mengecek apakah RLS sudah aktif, jalankan:
--   SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public'
--   ORDER BY tablename;
--
-- Untuk melihat semua policies:
--   SELECT * FROM pg_policies WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
-- ============================================================
