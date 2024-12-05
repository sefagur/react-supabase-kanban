import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import AuthBanner from '../components/AuthBanner';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Kayıt işlemi
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      console.log("Kayıt olan kullanıcı:", user);

      if (!user || !user.id) {
        throw new Error("Kullanıcı ID'si alınamadı");
      }

      // Profiles tablosuna kayıt
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          { 
            id: user.id,
            name: name
          }
        ], 
        { onConflict: 'id' });

      if (profileError) {
        console.error("Profil hatası:", profileError);
        throw profileError;
      }

      toast.success('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
      navigate('/login');
    } catch (error) {
      console.error("Hata detayı:", error);
      let errorMessage = 'Bir hata oluştu.';
      if (error.message.includes('already registered')) {
        errorMessage = 'Bu e-posta adresi zaten kayıtlı.';
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AuthBanner 
        testimonial="Taskero'ya katılın ve projelerinizi daha verimli yönetin. Sezgisel arayüzü ve güçlü özellikleriyle iş akışınızı optimize edin."
        author="Sefa GÜR"
        role="Yazılım Geliştirici"
      />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-dark-primary">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-dark-text">Hesap Oluştur</h2>
            <p className="mt-2 text-dark-text/70">Hemen ücretsiz kayıt olun</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Ad Soyad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-dark-muted" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-dark-border rounded-lg bg-dark-accent text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-dark-muted" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-dark-border rounded-lg bg-dark-accent text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-dark-muted" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-dark-border rounded-lg bg-dark-accent text-dark-text placeholder-dark-muted focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-shadow"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 border border-transparent rounded-lg bg-brand-primary text-dark-text hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Kayıt yapılıyor...</span>
                </>
              ) : (
                <span>Kayıt Ol</span>
              )}
            </button>

            <div className="text-center">
              <p className="text-dark-text">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="text-brand-primary hover:text-brand-primary/80 transition-colors">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
