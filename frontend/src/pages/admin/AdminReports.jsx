import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminReports = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/all');
            const completed = res.data.filter(o => o.status === 'COMPLETED');
            completed.sort((a, b) => b.id - a.id);
            setOrders(completed);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    if (loading) return <div className="p-8 text-[#c5a059] font-bold animate-pulse">Yükleniyor...</div>;

    return (
        <div className="relative h-full flex flex-col space-y-8">
            {/* Header Area */}
            <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-[#2e1a14]/20 border border-[#c5a059]/40 rounded-full flex items-center justify-center text-[#c5a059] shadow-lg">☕</div>
                      <h2 className="text-2xl font-bold text-[#2e1a14] tracking-tight">{t('admin.reportsTitle')}</h2>
                 </div>
                 <p className="text-[#2e1a14]/60 font-medium ml-16">{t('admin.reportsDesc')}</p>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-[#2e1a14] rounded-[2.5rem] border border-[#c5a059]/30 shadow-2xl p-10 relative overflow-hidden z-10 group">
                 <div className="absolute inset-0 bg-wood-pattern opacity-10 pointer-events-none"></div>
                 <div className="relative z-10 flex items-center gap-8">
                      <div className="w-20 h-20 bg-black/20 rounded-[2rem] border border-[#c5a059]/30 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                           💰
                      </div>
                      <div>
                           <p className="text-[#c5a059] text-xs font-bold uppercase tracking-[0.3em] mb-2 opacity-80">{t('admin.totalRevenueConfirmed')}</p>
                           <p className="text-5xl font-bold text-[#f5f5dc] tracking-tight">₺{totalRevenue.toFixed(2)}</p>
                      </div>
                 </div>
            </div>

            {/* Orders Table Container */}
            <div className="flex-1 bg-[#f9f7f2] rounded-[3rem] border border-[#c5a059]/30 shadow-2xl relative overflow-hidden flex flex-col z-10">
                 <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                 
                 <div className="bg-[#2e1a14] px-10 py-6 border-b border-[#c5a059]/20">
                      <div className="grid grid-cols-4 text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.2em]">
                           <span>{t('admin.orderId')}</span>
                           <span className="text-center">{t('admin.table')}</span>
                           <span className="text-center">{t('admin.content')}</span>
                           <span className="text-right">{t('admin.amount')}</span>
                      </div>
                 </div>

                 <div className="flex-1 overflow-auto">
                      <table className="w-full">
                           <tbody className="divide-y divide-[#c5a059]/10">
                                {orders.map((order) => (
                                     <tr key={order.id} className="hover:bg-[#2e1a14]/5 transition-colors">
                                          <td className="px-10 py-6 text-sm font-bold text-[#2e1a14] opacity-80">#{order.id}</td>
                                          <td className="px-10 py-6 text-center text-sm font-bold text-[#2e1a14]">{order.tableNumber}</td>
                                          <td className="px-10 py-6 text-center text-sm font-medium text-[#2e1a14]/60 italic line-clamp-1">
                                               {order.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
                                          </td>
                                          <td className="px-10 py-6 text-right text-lg font-bold text-[#1a3a2a]">₺{order.totalPrice.toFixed(2)}</td>
                                     </tr>
                                ))}
                                {orders.length === 0 && (
                                     <tr>
                                          <td colSpan="4" className="px-10 py-32 text-center text-[#2e1a14]/40 font-bold italic text-xl">
                                               {t('admin.noCompletedOrders')}
                                          </td>
                                     </tr>
                                )}
                           </tbody>
                      </table>
                 </div>

                 {/* Süslemeler */}
                 <div className="h-24 flex items-center justify-center gap-12 opacity-10 filter grayscale pointer-events-none border-t border-[#c5a059]/10">
                      <span className="text-4xl text-[#2e1a14]">📊</span>
                      <span className="text-4xl text-[#2e1a14]">👨‍🍳</span>
                      <span className="text-4xl text-[#2e1a14]">🍽️</span>
                      <span className="text-4xl text-[#2e1a14]">🍝</span>
                 </div>
            </div>

            {/* Süslemeler */}
            <div className="absolute bottom-6 left-6 pointer-events-none flex items-end gap-2 z-20">
                 <span className="text-4xl filter drop-shadow-lg">🍅</span>
                 <span className="text-3xl filter drop-shadow-lg opacity-80">🌿</span>
            </div>
        </div>
    );
};

export default AdminReports;