import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';
import { showSuccess, showError } from '../lib/toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Fetch profile dari tabel profiles ───
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    // Pakai array select (tanpa .single()) agar tidak error kalau data null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (error) {
      console.error('Gagal memuat profil:', error.message);
      setProfile(null);
    } else if (data && data.length > 0) {
      setProfile(data[0]);
      console.log('Profile loaded:', data[0].role, data[0].full_name);
    } else {
      // Profile belum ada di database → coba insert manual
      console.warn('Profile belum ada, mencoba membuat...');
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, full_name: '', role: 'member', points: 0, tier: 'Bronze' })
        .select();

      if (insertError) {
        console.error('Gagal membuat profile:', insertError.message);
        // Fallback: profil default lokal
        setProfile({ id: userId, full_name: '', role: 'member', points: 0, tier: 'Bronze' });
      } else if (insertData && insertData.length > 0) {
        setProfile(insertData[0]);
        console.log('Profile created:', insertData[0].role);
      }
    }
  }, []);

  // ─── Refresh profile (pakai user id dari state) ───
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    await fetchProfile(user.id);
  }, [user?.id, fetchProfile]);

  // ─── Load session saat pertama render ───
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Ambil session yang tersimpan
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('Auth init error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchProfile]);

  // ─── Listen perubahan auth state (login/logout dari tab lain) ───
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'SIGNED_IN' && currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      } else if (event === 'USER_UPDATED' && currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
    });

    return () => subscription?.unsubscribe();
  }, [fetchProfile]);

  // ─── Login ───
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id);
      showSuccess('Login berhasil!', `Selamat datang kembali!`);

      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      const message =
        err.message === 'Invalid login credentials'
          ? 'Email atau password salah. Silakan coba lagi.'
          : err.message || 'Gagal login. Silakan coba lagi.';

      showError('Login gagal', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  // ─── Register ───
  const register = useCallback(async (email, password, fullName) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) throw error;

      showSuccess(
        'Registrasi berhasil!',
        'Silakan cek email Anda untuk konfirmasi akun.'
      );

      return { success: true, user: data.user };
    } catch (err) {
      const message = err.message || 'Gagal registrasi. Silakan coba lagi.';
      showError('Registrasi gagal', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Logout ───
  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);
      showSuccess('Berhasil logout!');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  }, []);

  // ─── Forgot Password ───
  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      showSuccess(
        'Email terkirim!',
        'Silakan cek email Anda untuk mereset password.'
      );
      return { success: true };
    } catch (err) {
      const message = err.message || 'Gagal mengirim email reset.';
      showError('Gagal', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Nilai Context (dimemoize agar tidak re-render terus) ───
  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    fetchProfile,
    refreshProfile,
    isAdmin: profile?.role === 'admin',
    isMember: profile?.role === 'member',
    isGuest: !user,
  }), [user, profile, session, loading, login, register, logout, forgotPassword, fetchProfile, refreshProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipanggil di dalam AuthProvider');
  }
  return context;
}

export default AuthContext;
