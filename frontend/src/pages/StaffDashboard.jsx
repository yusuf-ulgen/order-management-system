import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Generate beep sound using Web Audio API
const playBeep = (type = 'order') => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(type === 'order' ? 880 : 660, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(type === 'order' ? 440 : 330, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        if (type === 'order') {
            setTimeout(() => {
                const ctx2 = new (window.AudioContext || window.webkitAudioContext)();
                const osc2 = ctx2.createOscillator();
                const g2 = ctx2.createGain();
                osc2.connect(g2); g2.connect(ctx2.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, ctx2.currentTime);
                g2.gain.setValueAtTime(0.6, ctx2.currentTime);
                g2.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.4);
                osc2.start(); osc2.stop(ctx2.currentTime + 0.4);
            }, 300);
        }
    } catch (e) { /* browser blocked audio */ }
};

const StaffDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [waiterCalls, setWaiterCalls] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const prevOrderCount = useRef(0);
    const prevCallCount = useRef(0);
    const { t } = useTranslation();

    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get('/orders');
            const newOrders = res.data;
            if (prevOrderCount.current > 0 && newOrders.length > prevOrderCount.current) {
                playBeep('order');
            }
            prevOrderCount.current = newOrders.length;
            setOrders(newOrders);
        } catch (e) { console.error(e); }
    }, []);

    const fetchWaiterCalls = useCallback(async () => {
        try {
            const res = await api.get('/waiter-calls/active');
            const newCalls = res.data;
            if (prevCallCount.current > 0 && newCalls.length > prevCallCount.current) {
                playBeep('waiter');
            }
            prevCallCount.current = newCalls.length;
            setWaiterCalls(newCalls);
        } catch (e) { /* ignore */ }
    }, []);

    const fetchTables = useCallback(async () => {
        try {
            const res = await api.get('/tables');
            setTables(res.data);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        Promise.all([fetchOrders(), fetchWaiterCalls(), fetchTables()]).finally(() => setLoading(false));
        const interval = setInterval(() => {
            fetchOrders();
            fetchWaiterCalls();
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders, fetchWaiterCalls, fetchTables]);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status?status=${newStatus}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (e) {
            console.error(e);
        }
    };

    const toggleTableOccupied = async (table) => {
        try {
            await api.put(`/tables/${table.id}`, { ...table, occupied: !table.occupied });
            setTables(prev => prev.map(t => t.id === table.id ? { ...t, occupied: !t.occupied } : t));
        } catch (e) { console.error(e); }
    };

    const dismissWaiterCall = async (callId) => {
        try {
            await api.put(`/waiter-calls/${callId}/dismiss`);
            setWaiterCalls(prev => prev.filter(c => c.id !== callId));
        } catch (e) { console.error(e); }
    };

    const newOrders = orders.filter(o => o.status === 'NEW');
    const preparingOrders = orders.filter(o => o.status === 'PREPARING');

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-[#061e14]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#c5a059]"></div>
        </div>
    );

    const BgOrnaments = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute bottom-10 left-10">🍅</div>
            <div className="absolute top-1/2 left-20">🍃</div>
            <div className="absolute bottom-1/4 right-20 scale-150">🌿</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#061e14] relative flex flex-col font-serif overflow-hidden">
            <BgOrnaments />
            
            {/* Header */}
            <header className="relative z-10 p-8 flex justify-between items-start max-w-7xl mx-auto w-full">
                <div>
                     <h1 className="text-4xl font-bold text-[#f5f5dc] tracking-tight">Mutfak Paneli</h1>
                     <p className="text-[#c5a059] text-sm mt-1 font-medium opacity-80">Canlı Sipariş Takip Sistemi</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="bg-black/20 border border-[#c5a059]/30 rounded-full px-4 py-1.5 flex items-center gap-3 text-[#f5f5dc] text-xs font-bold">
                         <span>TR</span>
                         <span className="w-px h-3 bg-[#c5a059]/30"></span>
                         <div className="flex items-center gap-2">
                             <span className="w-1.5 h-1.5 bg-[#81c784] rounded-full animate-pulse"></span>
                             <span className="opacity-70">Sistem Aktif</span>
                         </div>
                     </div>
                     <button onClick={() => window.location.reload()} className="w-12 h-12 border border-[#c5a059]/30 rounded-full flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                     </button>
                </div>
            </header>

            {/* Content Area Border Top */}
            <div className="relative z-10 w-full flex items-center gap-4 px-8 max-w-7xl mx-auto">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>
                <div className="rotate-45 w-1.5 h-1.5 border border-[#c5a059]"></div>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#c5a059]/50 to-transparent"></div>
            </div>

            {/* Tab Bar */}
            <div className="relative z-10 px-8 py-6 max-w-7xl mx-auto w-full flex gap-4">
                 <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-[#1a3a2a] text-[#c5a059] border border-[#c5a059]/40 shadow-lg' : 'bg-[#f5f5dc]/5 text-[#c5a059]/60 border border-transparent hover:bg-[#f5f5dc]/10'}`}>
                     <span className={activeTab === 'orders' ? 'opacity-100' : 'opacity-50'}>🔥</span>
                     Siparişler
                 </button>
                 <button onClick={() => setActiveTab('waiter')} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'waiter' ? 'bg-[#1a3a2a] text-[#c5a059] border border-[#c5a059]/40 shadow-lg' : 'bg-[#f5f5dc]/5 text-[#c5a059]/60 border border-transparent hover:bg-[#f5f5dc]/10'}`}>
                     <span className={activeTab === 'waiter' ? 'opacity-100' : 'opacity-50'}>🔔</span>
                     Garson Çağrıları
                 </button>
                 <button onClick={() => setActiveTab('tables')} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'tables' ? 'bg-[#1a3a2a] text-[#c5a059] border border-[#c5a059]/40 shadow-lg' : 'bg-[#f5f5dc]/5 text-[#c5a059]/60 border border-transparent hover:bg-[#f5f5dc]/10'}`}>
                     <span className={activeTab === 'tables' ? 'opacity-100' : 'opacity-50'}>📋</span>
                     Masalar
                 </button>
            </div>

            {/* Glass Content Panel */}
            <main className="relative z-10 flex-1 px-8 pb-8 max-w-7xl mx-auto w-full">
                 <div className="h-full bg-[#f9f7f2]/90 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden p-8 flex flex-col">
                      <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                      
                      {activeTab === 'orders' && (
                          <div className="grid grid-cols-2 gap-8 h-full">
                               {/* New Orders */}
                               <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                         <span className="text-xl">🔥</span>
                                         <h2 className="text-xl font-bold text-[#061e14]">Yeni Gelenler</h2>
                                         <div className="rotate-45 w-2 h-2 border border-[#c5a059]"></div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                         {newOrders.map(order => (
                                              <div key={order.id} onClick={() => updateOrderStatus(order.id, 'PREPARING')} className="bg-[#061e14]/90 rounded-2xl p-6 text-white cursor-pointer hover:bg-[#061e14] transition-colors shadow-lg group relative overflow-hidden">
                                                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                                                   <div className="relative z-10 flex justify-between items-start mb-4">
                                                        <div>
                                                             <h3 className="text-2xl font-bold tracking-tight">{order.tableNumber}</h3>
                                                             <p className="text-[#c5a059] text-xs font-bold uppercase tracking-widest mt-1">Sipariş #{order.id}</p>
                                                        </div>
                                                        <div className="bg-[#c5a059] text-[#061e14] px-3 py-1 rounded-lg text-sm font-bold">
                                                            ₺{order.totalPrice?.toFixed(2)}
                                                        </div>
                                                   </div>
                                                   <ul className="relative z-10 space-y-2 opacity-80 border-t border-white/10 pt-4">
                                                        {order.items?.map(item => (
                                                             <li key={item.id} className="text-sm font-medium flex gap-2">
                                                                  <span className="text-[#c5a059] font-bold">{item.quantity}x</span>
                                                                  <span>{item.product?.name}</span>
                                                             </li>
                                                        ))}
                                                   </ul>
                                                   <div className="mt-4 flex justify-end text-[10px] items-center gap-2 text-[#c5a059]">
                                                        <span>BAŞLATMAK İÇİN TIKLA</span>
                                                        <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-pulse"></span>
                                                   </div>
                                              </div>
                                         ))}
                                         {newOrders.length === 0 && (
                                              <div className="flex-1 flex flex-col items-center justify-center py-20 bg-black/5 rounded-3xl border-2 border-dashed border-[#061e14]/10">
                                                   <div className="w-16 h-16 bg-[#f9f7f2] rounded-2xl shadow-inner flex items-center justify-center mb-4 text-3xl opacity-30">🍽️</div>
                                                   <p className="text-[#061e14]/40 font-bold">Bekleyen sipariş yok.</p>
                                                   <div className="flex items-center gap-4 mt-6">
                                                        <div className="h-px w-8 bg-[#061e14]/10"></div>
                                                        <div className="text-[#c5a059] font-bold text-2xl">0</div>
                                                        <div className="h-px w-8 bg-[#061e14]/10"></div>
                                                   </div>
                                              </div>
                                         )}
                                    </div>
                               </div>

                               {/* Preparing Orders */}
                               <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                         <span className="text-xl">🟡</span>
                                         <h2 className="text-xl font-bold text-[#061e14]">Hazırlanıyor</h2>
                                         <div className="rotate-45 w-2 h-2 border border-[#c5a059]"></div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                         {preparingOrders.map(order => (
                                              <div key={order.id} onClick={() => updateOrderStatus(order.id, 'COMPLETED')} className="bg-[#2a4d3a]/90 rounded-2xl p-6 text-white cursor-pointer hover:bg-[#2a4d3a] transition-colors shadow-lg border border-[#c5a059]/20 relative overflow-hidden">
                                                   <div className="absolute top-0 right-0 p-4">
                                                        <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-ping"></div>
                                                   </div>
                                                   <div className="relative z-10 flex justify-between items-start mb-4">
                                                        <div>
                                                             <h3 className="text-2xl font-bold tracking-tight">{order.tableNumber}</h3>
                                                             <p className="text-[#c5a059] text-xs font-bold uppercase tracking-widest mt-1">Sipariş #{order.id}</p>
                                                        </div>
                                                        <div className="bg-white/10 text-[#c5a059] px-3 py-1 rounded-lg text-sm font-bold border border-white/10">
                                                            ₺{order.totalPrice?.toFixed(2)}
                                                        </div>
                                                   </div>
                                                   <ul className="relative z-10 space-y-2 opacity-80 border-t border-white/10 pt-4">
                                                        {order.items?.map(item => (
                                                             <li key={item.id} className="text-sm font-medium flex gap-2">
                                                                  <span className="text-[#c5a059] font-bold">{item.quantity}x</span>
                                                                  <span>{item.product?.name}</span>
                                                             </li>
                                                        ))}
                                                   </ul>
                                                   <div className="mt-4 flex justify-end text-[10px] items-center gap-2 text-[#81c784]">
                                                        <span>TAMAMLA</span>
                                                        <span className="w-1.5 h-1.5 bg-[#81c784] rounded-full animate-pulse"></span>
                                                   </div>
                                              </div>
                                         ))}
                                         {preparingOrders.length === 0 && (
                                              <div className="flex-1 flex flex-col items-center justify-center py-20 bg-black/5 rounded-3xl border-2 border-dashed border-[#061e14]/10">
                                                   <div className="w-16 h-16 bg-[#f9f7f2] rounded-2xl shadow-inner flex items-center justify-center mb-4 text-3xl opacity-30">⏳</div>
                                                   <p className="text-[#061e14]/40 font-bold">Hazırlanan sipariş yok.</p>
                                                   <div className="flex items-center gap-4 mt-6">
                                                        <div className="h-px w-8 bg-[#061e14]/10"></div>
                                                        <div className="text-[#c5a059] font-bold text-2xl">0</div>
                                                        <div className="h-px w-8 bg-[#061e14]/10"></div>
                                                   </div>
                                              </div>
                                         )}
                                    </div>
                               </div>
                          </div>
                      )}

                      {activeTab === 'waiter' && (
                          <div className="flex-1 flex flex-col items-center justify-center">
                               {waiterCalls.length === 0 ? (
                                   <div className="text-center">
                                        <div className="w-24 h-24 bg-[#f5f5dc] rounded-3xl shadow-sm border border-[#c5a059]/20 flex items-center justify-center mx-auto mb-8 text-4xl">🔔</div>
                                        <p className="text-2xl font-bold text-[#061e14] opacity-80">Bekleyen garson çağrısı yok.</p>
                                   </div>
                               ) : (
                                   <div className="grid grid-cols-3 gap-6 w-full">
                                        {waiterCalls.map(call => (
                                            <div key={call.id} onClick={() => dismissWaiterCall(call.id)} className="bg-[#061e14] rounded-3xl p-8 text-center cursor-pointer hover:scale-105 transition-transform shadow-2xl relative overflow-hidden group">
                                                 <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/10 to-transparent"></div>
                                                 <div className="text-5xl mb-6 group-hover:animate-bounce">🔔</div>
                                                 <h3 className="text-3xl font-bold text-[#f5f5dc] mb-2">{call.tableNumber}</h3>
                                                 <p className="text-[#c5a059] text-sm font-bold uppercase tracking-widest">Garson Bekliyor</p>
                                                 <button className="mt-8 bg-[#c5a059] text-[#061e14] w-full py-3 rounded-xl font-bold text-sm">TAMAMLA</button>
                                            </div>
                                        ))}
                                   </div>
                               )}
                          </div>
                      )}

                      {activeTab === 'tables' && (
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 overflow-y-auto pr-2 custom-scrollbar h-full">
                               {tables.map(table => (
                                   <div key={table.id} onClick={() => toggleTableOccupied(table)} className="bg-white rounded-3xl border border-[#c5a059]/20 p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1">
                                        <div className={`w-12 h-12 rounded-full mb-6 flex items-center justify-center transition-all ${table.occupied ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-[#81c784] shadow-[0_0_20px_rgba(129,199,132,0.4)]'}`}>
                                             <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#061e14] mb-1">{table.tableNumber}</h3>
                                        <p className={`text-sm font-bold opacity-40 mb-6 uppercase tracking-widest ${table.occupied ? 'text-red-600' : 'text-green-600'}`}>
                                            {table.occupied ? 'Dolu' : 'Boş'}
                                        </p>
                                        <button className="bg-[#f5f5dc] border border-[#c5a059]/30 text-[#061e14] px-8 py-2 rounded-xl text-xs font-bold group-hover:bg-[#c5a059] group-hover:text-white transition-colors">Düzenle</button>
                                   </div>
                               ))}
                          </div>
                      )}

                 </div>
            </main>

            {/* Content Area Border Bottom */}
            <div className="relative z-10 w-full flex items-center gap-4 px-8 max-w-7xl mx-auto mb-8">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>
                <div className="rotate-45 w-1.5 h-1.5 border border-[#c5a059]"></div>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#c5a059]/50 to-transparent"></div>
            </div>

            {/* Bottom Footer Ornament Area (as in images) */}
            <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none opacity-20">
                 <img src="https://via.placeholder.com/1920x600?text=Dark+Wood+Texture" alt="" className="w-full h-full object-cover mix-blend-multiply" />
            </div>

        </div>
    );
};

export default StaffDashboard;