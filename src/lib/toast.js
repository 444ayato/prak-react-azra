import { toast } from 'sonner';

/**
 * Reusable toast notification helpers for the entire app.
 * 
 * Usage:
 *   import { showSuccess, showError, showInfo, showWarning } from '@/lib/toast';
 *   showSuccess('Data berhasil disimpan!');
 *   showError('Gagal memuat data', error);
 */

export function showSuccess(message, description = '') {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

export function showError(message, error = null) {
  const description = error?.message || error?.error_description || '';
  toast.error(message, {
    description,
    duration: 5000,
  });
}

export function showInfo(message, description = '') {
  toast.info(message, {
    description,
    duration: 3000,
  });
}

export function showWarning(message, description = '') {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

/**
 * Promise-based toast for async operations (loading → success/error)
 * 
 * Usage:
 *   showPromise(
 *     supabase.from('products').insert(data),
 *     'Menyimpan produk...',
 *     'Produk berhasil disimpan!',
 *     'Gagal menyimpan produk'
 *   );
 */
export function showPromise(promise, loadingMsg, successMsg, errorMsg) {
  toast.promise(promise, {
    loading: loadingMsg || 'Loading...',
    success: successMsg || 'Berhasil!',
    error: (err) => errorMsg || err?.message || 'Terjadi kesalahan',
  });
}

/**
 * Dismiss all active toasts.
 */
export function dismissAll() {
  toast.dismiss();
}
