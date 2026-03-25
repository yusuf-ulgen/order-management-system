import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminOrders = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const STATUS_LABELS = {
        NEW: { label: t('admin.statusNew'), color: 'bg-blue-500/80 text-white' },
        PREPARING: { label: t('admin.statusPreparing'), color: 'bg-yellow-600/80 text-white' },
        COMPLETED: { label: t('admin.statusCompleted'), color: 'bg-green-700/80 text-white' },
        CANCELLED: { label: t('admin.statusCancelled'), color: 'bg-red-800/80 text-white' },
    };

    useEffect(() => {
        api.get('/orders/all').then(res => {
            setOrders(res.data.sort((a, b) => b.id - a.id));
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = orders.filter(o => {
        const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
        const matchSearch = !search ||
            o.tableNumber?.toLowerCase().includes(search.toLowerCase()) ||
            o.items?.some(i => i.product?.name?.toLowerCase().includes(search.toLowerCase()));
        return matchStatus && matchSearch;
    });

    const totalRevenue = filtered.filter(o => o.status === 'COMPLETED')
        .reduce((s, o) => s + (o.totalPrice || 0), 0);

    if (loading) return <div className="p-8 text-[#c5a059] font-bold animate-pulse">Yükleniyor...</div>;

    return (
        <div className="relative h-full flex flex-col space-y-6">
            {/* Header / Toolbar Area */}
            <div className="bg-[#2e1a14] rounded-3xl border border-[#c5a059]/30 shadow-2xl p-4 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden z-10">
                 <div className="absolute inset-0 bg-wood-pattern opacity-10 pointer-events-none"></div>
                 
                 {/* Filters Left */}
                 <div className="flex items-center gap-3 relative z-10">
                      <div className="relative">
                           <input
                               type="text"
                               placeholder="Masa veya ürün ara..."
                               value={search}
                               onChange={e => setSearch(e.target.value)}
                               className="bg-black/20 text-[#f5f5dc] border border-[#c5a059]/20 rounded-2xl px-6 py-3 pl-10 text-sm focus:border-[#c5a059] outline-none placeholder-[#c5a059]/30 w-64 shadow-inner font-bold"
                           />
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                      </div>
                      <select
                          value={statusFilter}
                          onChange={e => setStatusFilter(e.target.value)}
                          className="bg-black/20 text-[#f5f5dc] border border-[#c5a059]/20 rounded-2xl px-6 py-3 text-sm focus:border-[#c5a059] outline-none font-bold shadow-inner cursor-pointer"
                      >
                          <option value="ALL">Tüm Durumlar</option>
                          <option value="NEW">{t('admin.statusNew')}</option>
                          <option value="PREPARING">{t('admin.statusPreparing')}</option>
                          <option value="COMPLETED">{t('admin.statusCompleted')}</option>
                          <option value="CANCELLED">{t('admin.statusCancelled')}</option>
                      </select>
                 </div>

                 {/* Stats Right */}
                 <div className="bg-black/30 rounded-2xl border border-[#c5a059]/20 px-6 py-2 flex items-center gap-6 relative z-10 shadow-inner">
                      <div className="text-right">
                           <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-tighter opacity-70">TOPLAM CİRO</p>
                           <p className="text-xl font-bold text-[#f5f5dc] tabular-nums leading-none mt-1">₺{totalRevenue.toFixed(2)}</p>
                      </div>
                      <div className="w-[1px] h-8 bg-[#c5a059]/20"></div>
                      <div className="text-right">
                           <p className="text-[#c5a059] text-[9px] font-bold uppercase tracking-tighter opacity-70">SİPARİŞ</p>
                           <p className="text-xl font-bold text-[#f5f5dc] tabular-nums leading-none mt-1">{filtered.length}</p>
                      </div>
                 </div>
            </div>

            {/* Orders Table Container */}
            <div className="flex-1 bg-[#f9f7f2] rounded-[3rem] border border-[#c5a059]/30 shadow-2xl relative overflow-hidden flex flex-col z-10">
                 <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                 
                 <div className="bg-[#2e1a14] px-10 py-6 border-b border-[#c5a059]/20">
                      <div className="grid grid-cols-[1fr,1.5fr,3fr,1.5fr,1.5fr] text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.2em]">
                           <span>#Sipariş ID</span>
                           <span className="text-center">Masa</span>
                           <span className="text-center">Ürünler</span>
                           <span className="text-center">Tutar</span>
                           <span className="text-right">Durum</span>
                      </div>
                 </div>

                 <div className="flex-1 overflow-auto">
                      <table className="w-full">
                           <tbody className="divide-y divide-[#c5a059]/10">
                                {filtered.map((order, idx) => {
                                     const cfg = STATUS_LABELS[order.status] || STATUS_LABELS.NEW;
                                     return (
                                          <tr key={order.id} className="group hover:bg-[#2e1a14]/5 transition-colors">
                                               <td className="px-10 py-6 text-sm font-bold text-[#2e1a14] opacity-80 italic">#{order.id}</td>
                                               <td className="px-10 py-6 text-center text-sm font-bold text-[#2e1a14]">{order.tableNumber}</td>
                                               <td className="px-10 py-6 text-center text-sm font-medium text-[#2e1a14]/60 italic">
                                                    <div className="line-clamp-1">
                                                         {order.items?.map(i => `${i.quantity}x ${i.product?.name}`).join(', ') || '-'}
                                                    </div>
                                                    {order.note && <div className="text-[10px] text-[#2e1a14]/40 mt-1 uppercase font-bold tracking-widest">{t('admin.note')}: {order.note}</div>}
                                               </td>
                                               <td className="px-10 py-6 text-center text-lg font-bold text-[#1a3a2a]">₺{order.totalPrice?.toFixed(2)}</td>
                                               <td className="px-10 py-6 text-right">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg ${cfg.color}`}>
                                                         {cfg.label}
                                                    </span>
                                               </td>
                                          </tr>
                                     );
                                })}
                                {filtered.length === 0 && (
                                     <tr>
                                          <td colSpan="5" className="px-10 py-32 text-center text-[#2e1a14]/40 font-bold italic text-xl">
                                               {t('admin.noOrders')}
                                          </td>
                                     </tr>
                                )}
                           </tbody>
                      </table>
                 </div>

                 {/* Süslemeler - Görseldeki Çizimler */}
                 <div className="h-24 flex items-center justify-center gap-12 opacity-10 filter grayscale pointer-events-none border-t border-[#c5a059]/10">
                      <span className="text-4xl text-[#2e1a14]">🍽️</span>
                      <span className="text-4xl text-[#2e1a14]">🧑‍🍳</span>
                      <span className="text-4xl text-[#2e1a14]">🍷</span>
                      <span className="text-4xl text-[#2e1a14]">🍰</span>
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

export default AdminOrders;