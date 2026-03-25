import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [siteSettings, setSiteSettings] = useState(null);
    const selectedTable = 'Table 1';

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                setSiteSettings(response.data);
            } catch (error) {
                console.error("Failed to load site settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const BgOrnaments = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 select-none">
            <div className="absolute top-10 left-10 transform -rotate-12">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
                    <path d="M11,9H9V2H7V9H5V2H3V9c0,2.12,1.66,3.84,3.75,3.97V22h2.5v-9.03C11.34,12.84,13,11.12,13,9V2h-2V9z M16,6v8h3v8h2.5V2 c-3.04,0-5.5,2.46-5.5,4z"/>
                </svg>
            </div>
            <div className="absolute top-40 right-20 transform rotate-45">
                 <svg width="100" height="100" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5 s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z"/>
                </svg>
            </div>
            <div className="absolute bottom-40 left-20 transform -rotate-45">
                 <svg width="140" height="140" viewBox="0 0 24 24" fill="white">
                    <path d="M18.06,22.99l1.66-4.4c0.13-0.33,0.06-0.71-0.18-0.97l-3.21-3.4c-0.25-0.26-0.63-0.34-0.96-0.19l-4.41,1.93 c-0.5,0.22-0.53,0.91-0.06,1.18l2.97,1.72l-1.44,1.44c-0.2,0.2-0.2,0.51,0,0.71l1.41,1.41c0.2,0.2,0.51,0.2,0.71,0l1.44-1.44 l1.72,2.97C17.15,23.51,17.84,23.49,18.06,22.99z M15,4c-4.42,0-8,3.58-8,8s3.58,8,8,8s8-3.58,8-8S19.42,4,15,4z M15,18 c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S18.31,18,15,18z"/>
                </svg>
            </div>
            <div className="absolute bottom-10 right-10 transform rotate-12">
                 <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
                    <path d="M8.1,13.34l2.83-2.83L3.91,3.5c-1.56,1.56-1.56,4.09,0,5.66L8.1,13.34z M20.49,3.51c-1.56-1.56-4.09-1.56-5.66,0 l-7.01,7.01l2.83,2.83l7.01-7.01C19.22,5.07,19.22,4.28,20.49,3.51z M15.76,20.49c1.56,1.56,4.09,1.56,5.66,0l0.71-0.71 c1.56-1.56,1.56-4.09,0-5.66l-7.01-7.01l-2.83,2.83L15.76,20.49z M3.51,15.01c-1.56,1.56-1.56,4.09,0,5.66l0.71,0.71 c1.56,1.56,4.09,1.56,5.66,0l7.01-7.01l-2.83-2.83L3.51,15.01z"/>
                </svg>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#061e14] relative flex flex-col items-center py-12 px-4 md:px-8 font-serif">
            <BgOrnaments />

            {/* Header */}
            <header className="relative z-10 text-center mb-12">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                         <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-gold">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#c5a059" strokeWidth="2" strokeDasharray="5,5"/>
                            <path d="M35 40 L65 40 M30 50 L70 50 M35 60 L65 60" stroke="#c5a059" strokeWidth="3" strokeLinecap="round"/>
                            <path d="M40 30 Q50 20 60 30" fill="none" stroke="#c5a059" strokeWidth="3" strokeLinecap="round"/>
                         </svg>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#c5a059] tracking-[0.2em] mb-2 uppercase drop-shadow-lg">
                    {siteSettings?.restaurant_name?.toUpperCase() || "QR SİPARİŞ SİSTEMİ"}
                </h1>
                <p className="text-[#c5a059] text-xl italic font-light tracking-widest opacity-80">
                    Restoran Yönetim Paneli
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c5a059]"></div>
                    <div className="rotate-45 w-2 h-2 border border-[#c5a059]"></div>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c5a059]"></div>
                </div>
            </header>

            {/* Main Cards */}
            <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                
                {/* Müşteri Card */}
                <div className="premium-card group hover:scale-[1.02] transition-transform duration-500">
                    <div className="h-24 bg-gradient-to-br from-[#1a4a35] to-[#0a2e1f] flex items-center p-6 gap-4">
                        <div className="w-12 h-12 bg-[#c5a059]/20 rounded-full flex items-center justify-center border border-[#d4af37]/30">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-bold tracking-tight">Müşteri</h2>
                            <p className="text-white/60 text-xs italic">Sipariş ver & takip et</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <button onClick={() => navigate(`/menu?table=${selectedTable}`)} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#c5a059]/5 border border-transparent hover:border-[#c5a059]/20 transition-all group/item">
                            <div className="w-10 h-10 bg-[#0a2e1f] rounded-lg flex items-center justify-center text-xl">📖</div>
                            <div className="text-left flex-1">
                                <div className="text-[#0a2e1f] font-bold text-sm">Menüye Gözat</div>
                                <div className="text-[#0a2e1f]/60 text-[10px] italic">Lezzetli yemekleri incele</div>
                            </div>
                            <svg className="w-4 h-4 text-[#0a2e1f]/30 group-hover/item:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => navigate(`/order-status?table=${selectedTable}`)} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#c5a059]/5 border border-transparent hover:border-[#c5a059]/20 transition-all group/item">
                             <div className="w-10 h-10 bg-[#0a2e1f] rounded-lg flex items-center justify-center text-xl">📋</div>
                            <div className="text-left flex-1">
                                <div className="text-[#0a2e1f] font-bold text-sm">Siparişlerim</div>
                                <div className="text-[#0a2e1f]/60 text-[10px] italic">Aktif siparişini takip et</div>
                            </div>
                            <svg className="w-4 h-4 text-[#0a2e1f]/30 group-hover/item:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button className="w-full bg-gradient-to-r from-[#eac16e] to-[#c5a059] py-3 rounded-xl flex items-center justify-center gap-3 text-[#0a2e1f] font-bold text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                             <span>QR Kod ile Sipariş Ver</span>
                        </button>
                    </div>
                </div>

                {/* Personel Card */}
                <div className="premium-card group hover:scale-[1.02] transition-transform duration-500">
                    <div className="h-24 bg-gradient-to-br from-[#4a2e1f] to-[#2e1a14] flex items-center p-6 gap-4">
                        <div className="w-12 h-12 bg-[#c5a059]/20 rounded-full flex items-center justify-center border border-[#d4af37]/30">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-bold tracking-tight">Personel</h2>
                            <p className="text-white/60 text-xs italic">Mutfak & servis paneli</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <button onClick={() => navigate('/staff')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-red-200/50 hover:bg-red-50 transition-all group/item">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">🔥</div>
                            <div className="text-left flex-1">
                                <div className="text-red-900 font-bold text-sm">Personel Paneli</div>
                                <div className="text-red-900/60 text-[10px] italic">Siparişleri görüntüle & güncelle</div>
                            </div>
                            <svg className="w-4 h-4 text-red-900/30 group-hover/item:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <div className="flex justify-between items-center gap-2 pt-2">
                             <div className="flex-1 bg-white border border-[#e0dec5] rounded-xl p-3 text-center">
                                 <div className="text-[#c5a059] text-xl font-bold">12</div>
                                 <div className="text-[9px] uppercase font-bold text-gray-400">Yeni Sipariş</div>
                             </div>
                             <div className="flex-1 bg-white border border-[#e0dec5] rounded-xl p-3 text-center">
                                 <div className="text-[#c5a059] text-xl font-bold">5</div>
                                 <div className="text-[9px] uppercase font-bold text-gray-400">Hazırlanıyor</div>
                             </div>
                             <div className="flex-1 bg-white border border-[#e0dec5] rounded-xl p-3 text-center">
                                 <div className="text-[#c5a059] text-xl font-bold">28</div>
                                 <div className="text-[9px] uppercase font-bold text-gray-400">Tamamlandı</div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Yönetim Card */}
                <div className="premium-card group hover:scale-[1.02] transition-transform duration-500">
                    <div className="h-24 bg-gradient-to-br from-[#1b2a4a] to-[#0a152e] flex items-center p-6 gap-4">
                        <div className="w-12 h-12 bg-[#c5a059]/20 rounded-full flex items-center justify-center border border-[#d4af37]/30">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M5 20V8l7-4 7 4v12M9 20v-4h6v4"/></svg>
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-bold tracking-tight">Yönetim</h2>
                            <p className="text-white/60 text-xs italic">Sistem kontrolü</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#c5a059]/5 border border-transparent hover:border-[#c5a059]/20 transition-all group/item">
                            <div className="w-10 h-10 bg-[#0a152e] rounded-lg flex items-center justify-center text-xl">📊</div>
                            <div className="text-left flex-1">
                                <div className="text-[#0a152e] font-bold text-sm">Admin Paneli</div>
                                <div className="text-[#0a152e]/60 text-[10px] italic">Dashboard & raporlar</div>
                            </div>
                            <svg className="w-4 h-4 text-[#0a152e]/30 group-hover/item:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => navigate('/admin/settings')} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#c5a059]/5 border border-transparent hover:border-[#c5a059]/20 transition-all group/item">
                             <div className="w-10 h-10 bg-[#0a152e] rounded-lg flex items-center justify-center text-xl">⚙️</div>
                            <div className="text-left flex-1">
                                <div className="text-[#0a152e] font-bold text-sm">Ayarlar</div>
                                <div className="text-[#0a152e]/60 text-[10px] italic">Sistem yapılandırması</div>
                            </div>
                            <svg className="w-4 h-4 text-[#0a152e]/30 group-hover/item:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => navigate('/admin/login')} className="w-full bg-[#0a152e] py-3 rounded-xl flex items-center justify-center gap-3 text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                             <span>Giriş Yap</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Featured Features */}
            <section className="relative z-10 w-full max-w-6xl mb-16">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#c5a059]/30"></div>
                    <div className="flex items-center gap-2">
                         <div className="rotate-45 w-2 h-2 border border-[#c5a059]/60"></div>
                         <h3 className="text-[#c5a059] text-xl font-bold tracking-[0.2em] px-4">Öne Çıkan Özellikler</h3>
                         <div className="rotate-45 w-2 h-2 border border-[#c5a059]/60"></div>
                    </div>
                    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#c5a059]/30"></div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="premium-glass-card p-6 flex flex-col items-center text-center group hover:bg-[#c5a059]/5 transition-all">
                        <div className="w-14 h-14 bg-[#0a2e1f] rounded-2xl flex items-center justify-center mb-4 border border-[#c5a059]/20 group-hover:scale-110 transition-transform">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/></svg>
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1 tracking-wide">QR Kod Sipariş</h4>
                        <p className="text-white/40 text-[10px] italic">Hızlı & temassız</p>
                    </div>
                    <div className="premium-glass-card p-6 flex flex-col items-center text-center group hover:bg-[#c5a059]/5 transition-all">
                        <div className="w-14 h-14 bg-[#4a1a1a]/50 rounded-2xl flex items-center justify-center mb-4 border border-[#c5a059]/20 group-hover:scale-110 transition-transform">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1 tracking-wide">Anlık Mutfak</h4>
                        <p className="text-white/40 text-[10px] italic">Canlı sipariş takibi</p>
                    </div>
                    <div className="premium-glass-card p-6 flex flex-col items-center text-center group hover:bg-[#c5a059]/5 transition-all">
                        <div className="w-14 h-14 bg-[#1a2a4a]/50 rounded-2xl flex items-center justify-center mb-4 border border-[#c5a059]/20 group-hover:scale-110 transition-transform">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1 tracking-wide">Detaylı Rapor</h4>
                        <p className="text-white/40 text-[10px] italic">Günlük analizler</p>
                    </div>
                    <div className="premium-glass-card p-6 flex flex-col items-center text-center group hover:bg-[#c5a059]/5 transition-all">
                        <div className="w-14 h-14 bg-[#4a3a1a]/50 rounded-2xl flex items-center justify-center mb-4 border border-[#c5a059]/20 group-hover:scale-110 transition-transform">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c5a059" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        </div>
                        <h4 className="text-white font-bold text-sm mb-1 tracking-wide">Akıllı Bildirim</h4>
                        <p className="text-white/40 text-[10px] italic">Sesli & görsel uyarı</p>
                    </div>
                </div>
            </section>

            {/* Stats Footer */}
            <footer className="relative z-10 w-full max-w-6xl bg-[#0a2e1f] rounded-3xl p-8 border border-[#c5a059]/20 flex flex-wrap justify-between items-center gap-8 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="text-[#c5a059] text-2xl">🍽️</div>
                    <div className="text-left">
                        <div className="text-[#c5a059] text-2xl font-bold">156</div>
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">Toplam Ürün</div>
                    </div>
                </div>
                <div className="w-[1px] h-10 bg-[#c5a059]/20 hidden lg:block"></div>
                <div className="flex items-center gap-4">
                    <div className="text-[#c5a059] text-2xl">📋</div>
                    <div className="text-left">
                        <div className="text-[#c5a059] text-2xl font-bold">89</div>
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">Bugünkü Sipariş</div>
                    </div>
                </div>
                <div className="w-[1px] h-10 bg-[#c5a059]/20 hidden lg:block"></div>
                <div className="flex items-center gap-4">
                    <div className="text-[#c5a059] text-2xl">⭐</div>
                    <div className="text-left">
                        <div className="text-[#c5a059] text-2xl font-bold">4.8</div>
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">Müşteri Puanı</div>
                    </div>
                </div>
                <div className="w-[1px] h-10 bg-[#c5a059]/20 hidden lg:block"></div>
                 <div className="flex items-center gap-4">
                    <div className="text-[#c5a059] text-2xl">🕒</div>
                    <div className="text-left">
                        <div className="text-[#c5a059] text-2xl font-bold">12 dk</div>
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">Ort. Hazırlık</div>
                    </div>
                </div>
                <div className="w-[1px] h-10 bg-[#c5a059]/20 hidden lg:block"></div>
                 <div className="flex items-center gap-4">
                    <div className="text-[#c5a059] text-2xl">🗓️</div>
                    <div className="text-left">
                        <div className="text-[#c5a059] text-2xl font-bold">7/24</div>
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">Aktif Sistem</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;