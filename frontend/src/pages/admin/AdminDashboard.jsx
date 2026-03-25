import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeProducts: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    api.get('/orders/all'),
                    api.get('/products')
                ]);

                const orders = ordersRes.data;
                const products = productsRes.data;

                const completedOrders = orders.filter(o => o.status === 'COMPLETED');
                const revenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

                setStats({
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    activeProducts: products.filter(p => p.available).length
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ icon, label, value, color }) => (
        <div className="bg-[#2e1a14] rounded-[2rem] border border-[#c5a059]/30 shadow-2xl p-8 flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all">
             <div className="absolute inset-0 bg-wood-pattern opacity-10 pointer-events-none"></div>
             <div>
                  <p className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">{label}</p>
                  <p className="text-3xl font-bold text-[#f5f5dc] tracking-tight">{value}</p>
             </div>
             <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center border border-[#c5a059]/20 shadow-inner group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{icon}</span>
             </div>
        </div>
    );

    return (
        <div className="relative h-full flex flex-col space-y-10">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <StatCard 
                    label="Toplam Sipariş" 
                    value={stats.totalOrders} 
                    icon="📊"
                />
                <StatCard 
                    label="Toplam Ciro" 
                    value={`${stats.totalRevenue.toFixed(2)} ₺`} 
                    icon="💰"
                />
                <StatCard 
                    label="Aktif Ürünler" 
                    value={stats.activeProducts} 
                    icon="📦"
                />
            </div>

            {/* Quick Access Area */}
            <div className="flex-1 flex flex-col relative z-10">
                 <div className="bg-[#2e1a14] rounded-t-[2.5rem] border-x border-t border-[#c5a059]/30 p-8 shadow-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-wood-pattern opacity-10 pointer-events-none"></div>
                      <h2 className="text-2xl font-bold text-[#f5f5dc] tracking-tight">Hızlı Erişim</h2>
                 </div>
                 <div className="flex-1 bg-[#f9f7f2] rounded-b-[2.5rem] border-x border-b border-[#c5a059]/30 p-10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                      <div className="relative z-10">
                           <p className="text-[#2e1a14] text-lg font-medium leading-relaxed opacity-80">
                               Sol ahşap menüyü kullanarak kategori, ürün ve masalarınızı kolayca yönetebilirsiniz. Detaylı ciro istatistikleri 'Raporlar' bölümünde yer almaktadır.
                           </p>

                           {/* Süsleme Çizimleri - Görseldeki gibi basit ikonlar */}
                           <div className="mt-12 flex justify-center gap-12 opacity-20 filter grayscale contrast-125">
                                <span className="text-6xl text-[#2e1a14]">🍵</span>
                                <span className="text-6xl text-[#2e1a14]">👨‍🍳</span>
                                <span className="text-6xl text-[#2e1a14]">🍴</span>
                                <span className="text-6xl text-[#2e1a14]">🍕</span>
                           </div>
                      </div>
                 </div>
            </div>

            {/* Süslemeler - Görsele Sadık */}
            <div className="absolute bottom-6 left-6 pointer-events-none flex items-end gap-2 z-20">
                 <span className="text-4xl filter drop-shadow-lg">🍅</span>
                 <span className="text-3xl filter drop-shadow-lg opacity-80">🌿</span>
            </div>
        </div>
    );
};

export default AdminDashboard;