import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

function Layout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUser(data);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <nav className="border-b border-dark-border bg-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-info bg-clip-text text-transparent">
                  Taskero
                </span>
            </div>
            
            <div className="flex items-center space-x-6">
              {user && (
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-dark-text">
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-danger hover:opacity-90 text-white transition-all"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Çıkış</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
