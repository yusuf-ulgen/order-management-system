import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        )},
        { path: '/admin/categories', label: 'Kategoriler', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        )},
        { path: '/admin/products', label: 'Ürünler', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        )},
        { path: '/admin/tables', label: 'Masalar', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        )},
        { path: '/admin/reports', label: 'Raporlar', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        )},
        { path: '/admin/orders', label: 'Sipariş Geçmişi', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        )},
        { path: '/admin/password', label: 'Şifre Değiştir', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        )},
        { path: '/admin/users', label: 'Kullanıcılar', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        )},
        { path: '/admin/settings', label: 'Site Ayarları', icon: (active) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        )},
    ];

    const getPageTitle = () => {
        const item = navItems.find(i => i.path === location.pathname);
        return item ? item.label : 'Yönetim Paneli';
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen flex bg-[#061e14] font-serif overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2e1a14] flex-shrink-0 flex flex-col border-r border-black/20 shadow-2xl relative z-20">
                <div className="absolute inset-0 bg-wood-pattern opacity-10 pointer-events-none"></div>
                
                <div className="py-12 flex justify-center border-b border-black/10">
                     <div className="w-24 h-24 bg-[#061e14]/20 border-[3px] border-[#c5a059] rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
                         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f5f5dc" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                     </div>
                </div>

                <nav className="flex-1 py-6 space-y-1 relative z-10 overflow-y-auto hidden-scrollbar">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center gap-4 px-6 py-3 transition-all relative ${isActive ? 'text-white' : 'text-[#f5f5dc]/50 hover:text-[#f5f5dc]'}`}
                            >
                                {isActive && (
                                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#81c784] to-[#4caf50]/20 border-l-[4px] border-[#81c784] w-full"></div>
                                )}
                                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-[#c5a059]/60 group-hover:text-[#c5a059]'}`}>
                                    {item.icon(isActive)}
                                </span>
                                <span className="relative z-10 font-bold text-xs tracking-wide uppercase">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-black/10 relative z-10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#c5a059] hover:bg-black/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-[#c5a059]/20"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        {t('admin.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* Redesigned Header */}
                <header className="h-24 bg-[#0a2e1f] flex items-center justify-between px-10 relative z-10 border-b border-[#c5a059]/30">
                     <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-[#061e14]/40 border-2 border-[#c5a059] rounded-full flex items-center justify-center shadow-inner">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f5dc" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                          </div>
                          <div>
                               <h2 className="text-2xl font-bold text-[#f5f5dc] tracking-tight">{getPageTitle()}</h2>
                               <p className="text-[#c5a059] text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">
                                   {location.pathname.includes('settings') ? 'Restoran bilgilerini ve görsellerini buradan güncelleyin.' : 'Yönetim Paneli'}
                               </p>
                          </div>
                     </div>
                     <div className="flex items-center gap-4">
                          <div className="border border-[#c5a059]/40 rounded-full px-3 py-1 text-[#c5a059] text-xs font-bold bg-black/10">TR</div>
                          <button className="w-10 h-10 border border-[#c5a059]/30 rounded-full flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors">
                               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                          </button>
                     </div>
                </header>

                <div className="absolute inset-x-10 bottom-full h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent"></div>

                {/* Content Area Border Decoration */}
                <div className="px-10 mt-[-1px]">
                     <div className="w-full flex items-center gap-4 mb-0.5">
                         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent"></div>
                         <div className="rotate-45 w-1.5 h-1.5 border border-[#c5a059]"></div>
                         <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#c5a059] to-transparent"></div>
                     </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto relative z-10 p-10 bg-ornament bg-[#f9f7f2]/95 backdrop-blur-sm mx-10 mb-10 rounded-3xl border border-white/20 shadow-2xl custom-scrollbar">
                    <Outlet />
                </main>

                {/* Background Food Ornaments */}
                <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none scale-150">🌿</div>
                <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none scale-150">🍅</div>
            </div>
        </div>
    );
};

export default AdminLayout;