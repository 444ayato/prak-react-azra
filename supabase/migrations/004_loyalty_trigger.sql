-- ============================================================
-- MIGRATION 004: Loyalty System - Points & Tier Trigger
-- ============================================================
-- Otomatis menghitung poin dan tier member setiap kali
-- status pesanan berubah menjadi 'completed'.
--
-- Logic:
--   - Poin = FLOOR(total_amount / 10000)  (Rp 10.000 = 1 poin)
--   - Tier:
--       Bronze:   < 100 poin
--       Silver:   100 - 499 poin
--       Gold:     >= 500 poin
-- ============================================================

-- 1. Buat function untuk update points & tier
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

-- 2. Buat trigger pada tabel orders
DROP TRIGGER IF EXISTS on_order_completed ON orders;
CREATE TRIGGER on_order_completed
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_loyalty_points();

-- ============================================================
-- CATATAN PENTING:
-- ============================================================
-- Trigger ini hanya aktif jika kolom 'status' berubah.
-- Jika UPDATE dilakukan tanpa mengubah status, trigger
-- tidak akan berjalan (efisien).
--
-- Untuk mengubah poin/tier member secara manual (oleh Admin):
--   UPDATE public.profiles
--   SET points = 500, tier = 'Gold'
--   WHERE id = '<UUID_MEMBER>';
--
-- Untuk melihat log perubahan poin, bisa ditambahkan tabel
-- terpisah (loyalty_log) untuk audit trail jika diperlukan.
-- ============================================================
