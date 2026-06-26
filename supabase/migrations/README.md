# 🗄️ Supabase Migrations - Sedap Admin Dashboard

Panduan untuk menjalankan migration SQL di Supabase Dashboard.

---

## Prasyarat

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project: `ynqjtqemcimxseswnoju`
3. Buka **SQL Editor**

---

## Urutan Eksekusi

Jalankan script SQL **berurutan** dari nomor 1 sampai 4:

### Step 1: Create Tables
Buka `001_create_tables.sql`, copy seluruh isi, paste ke SQL Editor, lalu klik **RUN**.

### Step 2: Trigger - Auto Create Profile
Buka `002_handle_new_user_trigger.sql`, copy seluruh isi, paste ke SQL Editor, lalu klik **RUN**.

### Step 3: RLS Policies
Buka `003_rls_policies.sql`, copy seluruh isi, paste ke SQL Editor, lalu klik **RUN**.

### Step 4: Loyalty Trigger
Buka `004_loyalty_trigger.sql`, copy seluruh isi, paste ke SQL Editor, lalu klik **RUN**.

---

## Verifikasi

Setelah semua migration berjalan, jalankan query berikut untuk verifikasi:

```sql
-- Cek tabel yang sudah dibuat
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Cek semua RLS policies
SELECT * FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Cek trigger yang aktif
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

Hasil yang diharapkan:
| Tabel | RLS Active |
|-------|-----------|
| profiles | ✅ Yes |
| products | ✅ Yes |
| orders | ✅ Yes |
| order_items | ✅ Yes |

---

## Membuat Admin User

1. Register user baru melalui aplikasi (otomatis mendapat role `member`)
2. Dapatkan UUID user dari tabel `profiles`
3. Jalankan query:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = '<UUID_DARI_USER>';
```

---

## Troubleshooting

| Error | Solusi |
|-------|--------|
| `relation "auth.users" does not exist` | Pastikan kamu menggunakan project Supabase yang sudah memiliki Auth diaktifkan |
| `permission denied to set search_path` | Hapus baris `SET search_path = ''` dari function, atau jalankan sebagai superuser |
| `trigger already exists` | Aman, skip - berarti trigger sudah aktif |
