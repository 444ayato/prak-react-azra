-- ================================================================
-- FIX: Infinite Recursion di RLS Policies
-- ================================================================
-- Penyebab: Policy profiles_select_admin melakukan SELECT ke
-- tabel profiles (yang juga punya RLS), menyebabkan loop tak
-- terbatas.
--
-- Solusi: Buat function SECURITY DEFINER yang bypass RLS,
-- lalu gunakan function ini di semua policy.
-- ================================================================

-- 1. Buat function is_admin() yang bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- 2. Hapus SEMUA policy yang ADA (biar bisa recreate tanpa error)
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;

DROP POLICY IF EXISTS "products_select_all" ON products;
DROP POLICY IF EXISTS "products_insert_admin" ON products;
DROP POLICY IF EXISTS "products_update_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin" ON products;

DROP POLICY IF EXISTS "orders_select_admin" ON orders;
DROP POLICY IF EXISTS "orders_select_own" ON orders;
DROP POLICY IF EXISTS "orders_insert_member" ON orders;
DROP POLICY IF EXISTS "orders_insert_admin" ON orders;
DROP POLICY IF EXISTS "orders_update_admin" ON orders;
DROP POLICY IF EXISTS "orders_delete_admin" ON orders;

DROP POLICY IF EXISTS "order_items_select_admin" ON order_items;
DROP POLICY IF EXISTS "order_items_select_own" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_member" ON order_items;
DROP POLICY IF EXISTS "order_items_insert_admin" ON order_items;
DROP POLICY IF EXISTS "order_items_update_admin" ON order_items;
DROP POLICY IF EXISTS "order_items_delete_admin" ON order_items;

-- 3. Buat ulang semua policy dengan function is_admin()
-- ===== PROFILES =====
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE
  USING (public.is_admin());

-- ===== PRODUCTS =====
CREATE POLICY "products_select_all" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_admin" ON products
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_update_admin" ON products
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "products_delete_admin" ON products
  FOR DELETE
  USING (public.is_admin());

-- ===== ORDERS =====
CREATE POLICY "orders_select_admin" ON orders
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "orders_insert_member" ON orders
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "orders_insert_admin" ON orders
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "orders_delete_admin" ON orders
  FOR DELETE
  USING (public.is_admin());

-- ===== ORDER_ITEMS =====
CREATE POLICY "order_items_select_admin" ON order_items
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid()));

CREATE POLICY "order_items_insert_member" ON order_items
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid()));

CREATE POLICY "order_items_insert_admin" ON order_items
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "order_items_update_admin" ON order_items
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "order_items_delete_admin" ON order_items
  FOR DELETE
  USING (public.is_admin());


-- ================================================================
-- 4. SETELAH INI: Upgrade role Anda
-- ================================================================
-- Jalankan query berikut (ganti email_anda@... dengan email Anda):
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE id = (SELECT id FROM auth.users WHERE email = 'email_anda@...');
--
-- ================================================================
