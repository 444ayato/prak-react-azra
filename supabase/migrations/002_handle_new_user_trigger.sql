-- ============================================================
-- MIGRATION 002: Handle New User Trigger
-- ============================================================
-- Membuat baris di tabel `profiles` secara otomatis
-- setiap kali user baru mendaftar via Supabase Auth.
-- ============================================================

-- 1. Buat function yang akan dipanggil oleh trigger
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

-- 2. Buat trigger yang aktif setelah INSERT di auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ★ PENTING: Seed Admin User
-- ============================================================
-- Setelah trigger di atas aktif, setiap user baru akan
-- mendapatkan role 'member'. Untuk membuat admin, jalankan:
--
--   1. Register user via UI (otomatis jadi member)
--   2. Update role secara manual di SQL Editor:
--
--   UPDATE public.profiles
--   SET role = 'admin'
--   WHERE id = '<UUID_DARI_USER_YANG_INGIN_JADI_ADMIN>';
--
-- Atau jika ingin insert manual (setelah auth.users terisi):
--
--   INSERT INTO public.profiles (id, full_name, role)
--   VALUES ('<UUID>', 'Admin Name', 'admin');
-- ============================================================
