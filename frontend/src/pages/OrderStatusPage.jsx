import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const OrderStatusPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tableNumber = queryParams.get('table') || sessionStorage.getItem('tableNumber') || 'Table 1';

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            const myOrders = res.data
                .filter(o => o.tableNumber === tableNumber)
                .sort((a, b) => b.id - a.id)
                .slice(0, 5);
            setOrders(myOrders);
        } catch (e) {
            console.error('Error fetching orders:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [tableNumber]);

    const BgOrnaments = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 select-none hover:opacity-10 transition-opacity">
            <div className="absolute top-10 left-10 transform -rotate-12">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M11,9H9V2H7V9H5V2H3V9c0,2.12,1.66,3.84,3.75,3.97V22h2.5v-9.03C11.34,12.84,13,11.12,13,9V2h-2V9z M16,6v8h3v8h2.5V2 c-3.04,0-5.5,2.46-5.5,4z"/></svg>
            </div>
            <div className="absolute bottom-20 right-10 transform rotate-12">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="white"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/></svg>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#061e14]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#c5a059]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#061e14] relative flex flex-col font-serif">
            <BgOrnaments />
            
            {/* Header */}
            <header className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Sipariş Durumu</h1>
                    <p className="text-[#c5a059] text-xs mt-0.5 tracking-widest uppercase opacity-70">{tableNumber}</p>
                </div>
                <button onClick={fetchOrders} className="w-10 h-10 border border-[#c5a059]/30 rounded-full flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
            </header>

            {/* Content Area */}
            <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
                
                {/* Gold Border Top */}
                <div className="w-full max-w-3xl flex items-center gap-4 mb-4">
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent"></div>
                    <div className="rotate-45 w-2 h-2 border border-[#c5a059]"></div>
                    <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#c5a059] to-transparent"></div>
                </div>

                {/* Textured Central Panel */}
                <div className="w-full max-w-3xl aspect-[16/9] md:aspect-[21/9] bg-[#f9f7f2] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-8 bg-ornament shadow-2xl border border-white/20">
                    
                    {/* Decorative Veggies (SVG) */}
                    <div className="absolute top-10 left-10 opacity-20 transform -rotate-12 scale-150">🍅</div>
                    <div className="absolute bottom-10 right-10 opacity-20 transform rotate-45 scale-150">🌿</div>
                    <div className="absolute top-1/4 right-10 opacity-10">🥣</div>
                    <div className="absolute bottom-1/4 left-10 opacity-10">🥄</div>

                    {orders.length === 0 ? (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-[#f9f7f2] rounded-2xl border border-[#e0dec5] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c5a059/60" strokeWidth="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
                            </div>
                            <h2 className="text-[#061e14] text-3xl font-bold mb-2">Sipariş bulunamadı.</h2>
                            <p className="text-[#061e14]/40 text-sm italic mb-8 uppercase tracking-widest">Sipariş bulunamadı.</p>
                            
                            <button 
                                onClick={() => navigate('/menu')}
                                className="group relative bg-[#061e14] px-12 py-4 rounded-xl overflow-hidden shadow-lg active:scale-95 transition-transform"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e1f] to-[#061e14] opacity-100 group-hover:opacity-90 transition-opacity"></div>
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent"></div>
                                <span className="relative z-10 text-[#c5a059] font-bold tracking-[0.2em] uppercase text-sm">Menüye Git</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full space-y-4 overflow-y-auto max-h-full py-4 px-2 custom-scrollbar">
                             {orders.map(order => (
                                 <div key={order.id} className="bg-white/80 border border-[#e0dec5] rounded-2xl p-4 flex justify-between items-center shadow-sm">
                                     <div>
                                         <div className="text-[#061e14] font-bold text-sm">Sipariş #{order.id}</div>
                                         <div className="text-[#c5a059] text-xs font-bold uppercase mt-1 tracking-tighter">{order.status}</div>
                                     </div>
                                     <div className="text-right">
                                         <div className="text-[#061e14] font-bold">₺{Number(order.totalPrice).toFixed(2)}</div>
                                         <div className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    )}
                </div>

                {/* Gold Border Bottom */}
                <div className="w-full max-w-3xl flex items-center gap-4 mt-4">
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent"></div>
                    <div className="rotate-45 w-2 h-2 border border-[#c5a059]"></div>
                    <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#c5a059] to-transparent"></div>
                </div>

            </main>
        </div>
    );
};

export default OrderStatusPage;