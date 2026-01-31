import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect, useState } from "react";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const location = useLocation();

  // Fetch user data on mount
  useEffect(() => {
    if (token && !user.id) {
      axiosClient.get('/user')
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          setToken(null);
        });
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
      setIsOpen(false);
  }, [location]);

  if (!token) {
    return <Navigate to="/home" />
  }

  if (!user || !user.username) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">Memuat...</p>
        </div>
      </div>
    );
  }

  const onLogout = (ev) => {
    ev.preventDefault()
    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  const navLinks = [
      { name: 'Dashboard', path: '/dashboard', icon: '📊' },
      { name: 'Cek Harian', path: '/daily-check', role: 3, icon: '📝' },
      { name: 'PMC Game', path: '/pmc-game', role: 3, icon: '🎮' },
      { name: 'LiveChat AI', path: '/chat-ai', icon: '🤖' },
      { name: 'Janji Konseling', path: '/appointments', role: 3, icon: '🤝' },
      { name: 'Jadwal Konsultan', path: '/consultant/appointments', role: 2, icon: '📅' },
      { name: 'Atur Jadwal', path: '/schedules', role: 2, icon: '⚙️' },
      { name: 'Kelola User', path: '/user-management', role: 1, icon: '👥' },
  ];

  const bottomNavLinks = [
    { name: 'Home', path: '/dashboard', icon: '📊' },
    { name: 'Cek Harian', path: '/daily-check', role: 3, icon: '📝' },
    { name: 'LiveChat', path: '/chat-ai', icon: '🤖' },
    { name: 'Janji', path: '/appointments', role: 3, icon: '🤝' },
    { name: 'Konseling', path: '/consultant/appointments', role: 2, icon: '📅' },
    { name: 'Jadwal', path: '/schedules', role: 2, icon: '⚙️' },
    { name: 'Users', path: '/user-management', role: 1, icon: '👥' },
  ];

  return (
    <div id="defaultLayout" className="min-h-screen bg-background font-sans pb-24 lg:pb-0">
      {/* Navbar Desktop */}
      <nav className="bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100 hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex justify-between h-20">
                  <div className="flex items-center gap-12">
                      <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-3 group">
                          <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary text-2xl group-hover:scale-110 transition-all duration-300">
                             🌿
                          </div>
                          <span className="text-primary-dark font-black text-2xl tracking-tighter">ProbmaxCare</span>
                      </Link>
                      <div className="flex items-center gap-1">
                          {navLinks.map(link => (
                              (!link.role || link.role === user.role_id) && (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 flex items-center gap-2.5 ${
                                        location.pathname === link.path 
                                        ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.05]' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                                    }`}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    <span>{link.name}</span>
                                </Link>
                              )
                          ))}
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
                          <Link to="/profile" className="flex items-center gap-4 p-2 pr-5 rounded-2xl hover:bg-gray-50 transition-all group">
                              <div className="w-11 h-11 rounded-2xl bg-secondary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-secondary/20">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-800 font-black text-sm leading-tight">{user.username || 'User'}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Saya</span>
                              </div>
                          </Link>
                          <button onClick={onLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-50 text-red-600 font-black text-sm hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all group font-sans tracking-tight">
                              Keluar
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </nav>

      {/* Navbar Mobile Top */}
      <nav className="lg:hidden bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 px-4 h-16 flex items-center justify-between shadow-sm">
          <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="text-primary-dark font-black text-lg tracking-tight">ProbmaxCare</span>
          </Link>
          <div className="flex items-center gap-3">
              <Link to="/profile" className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-black text-sm">
                 {user.username?.charAt(0).toUpperCase()}
              </Link>
              <button onClick={() => setIsOpen(true)} className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
          </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        {notification && (
            <div className="bg-green-100 border-l-4 border-accent-green text-green-800 p-4 mb-8 shadow-md rounded-r-2xl flex items-center gap-3 animate-fade-in-down">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold shrink-0">✓</div>
                <span className="font-bold text-sm tracking-tight">{notification}</span>
            </div>
        )}
        <Outlet />
      </main>


      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
          <div className={`absolute inset-0 bg-primary-dark/40 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
          <div className={`absolute top-0 right-0 w-80 max-w-[85%] h-full bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">🌿</div>
                      <span className="text-primary-dark font-black text-xl">ProbmaxCare</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Navigasi Utama</p>
                      {navLinks.map(link => (
                         (!link.role || link.role === user.role_id) && (
                            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-black transition-all ${location.pathname === link.path ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <span className="text-2xl">{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                          )
                      ))}
                  </div>
                  <div className="pt-8 border-t border-gray-50 space-y-6">
                      <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-3xl bg-red-50 text-red-600 font-black text-sm hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95">
                          Keluar Aplikasi
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
