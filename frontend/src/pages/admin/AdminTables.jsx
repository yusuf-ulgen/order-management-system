import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminTables = () => {
    const { t } = useTranslation();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTable, setCurrentTable] = useState({ tableNumber: '' });

    const frontendBaseUrl = window.location.origin;

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await api.get('/tables');
            setTables(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tables:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentTable.id) {
                const res = await api.put(`/tables/${currentTable.id}`, currentTable);
                setTables(tables.map(t => t.id === currentTable.id ? res.data : t));
            } else {
                const res = await api.post('/tables', currentTable);
                setTables([...tables, res.data]);
            }
            setIsEditing(false);
            setCurrentTable({ tableNumber: '' });
        } catch (error) {
            console.error("Error saving table:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.confirmDeleteTable'))) {
            try {
                await api.delete(`/tables/${id}`);
                setTables(tables.filter(t => t.id !== id));
            } catch (error) {
                console.error("Error deleting table:", error);
            }
        }
    };

    const generateQRUrl = async (id) => {
        try {
            const res = await api.post(`/tables/${id}/generate-qr`);
            setTables(tables.map(t => t.id === id ? res.data : t));
        } catch (error) {
            console.error("Error generating QR:", error);
        }
    };

    if (loading) return <div className="p-8 text-[#c5a059] font-bold animate-pulse">Yükleniyor...</div>;

    return (
        <div className="relative h-full flex flex-col">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-10 relative z-10">
                 <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#2e1a14]/20 border border-[#c5a059]/40 rounded-full flex items-center justify-center text-[#c5a059] shadow-lg">☕</div>
                      <h2 className="text-2xl font-bold text-[#2e1a14] tracking-tight">Masalar & QR Kodlar</h2>
                 </div>
                 <button
                    onClick={() => { setCurrentTable({ tableNumber: '' }); setIsEditing(true); }}
                    className="px-8 py-3 bg-[#2e1a14] hover:bg-[#1a0f0b] text-[#f5f5dc] font-bold rounded-2xl shadow-xl transition-all border border-[#c5a059]/40 flex items-center gap-3 group"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform">+</span>
                    <span className="uppercase tracking-widest text-[10px]">Yeni Masa Ekle</span>
                </button>
            </div>

            <div className="flex-1 overflow-auto relative z-10 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {tables.map(table => (
                        <div key={table.id} className="bg-[#2e1a14] rounded-[3rem] border border-[#c5a059]/30 shadow-2xl p-8 flex flex-col group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                             <div className="absolute inset-0 bg-wood-pattern opacity-10 pointer-events-none"></div>

                             <div className="flex justify-between items-center mb-6 relative z-10">
                                  <h3 className="text-2xl font-bold text-[#f5f5dc] tracking-tight">Masa {table.tableNumber}</h3>
                                  <button 
                                      onClick={() => handleDelete(table.id)} 
                                      className="w-10 h-10 bg-black/30 text-red-400 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors border border-red-900/40"
                                  >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                  </button>
                             </div>

                             <div className="flex-1 bg-[#f9f7f2] rounded-3xl p-6 border border-[#c5a059]/20 shadow-inner relative overflow-hidden flex flex-col items-center justify-center space-y-4">
                                  <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                                  
                                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 relative z-10 group-hover:scale-105 transition-transform duration-500">
                                       <img
                                           src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(frontendBaseUrl + '/menu?table=' + table.tableNumber)}`}
                                           alt="QR"
                                           className="w-32 h-32"
                                       />
                                  </div>

                                  <div className="relative z-10 text-center">
                                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a3a2a]">Menü Linki</span>
                                       <div className="w-10 h-0.5 bg-[#1a3a2a]/20 mx-auto mt-1"></div>
                                  </div>
                             </div>

                             <button
                                 onClick={() => generateQRUrl(table.id)}
                                 className="mt-8 w-full bg-[#1a0f0b] border border-[#c5a059]/20 text-[#c5a059] font-bold py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
                             >
                                 QR Kodu Yenile
                             </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal - Premium Re-design */}
            {isEditing && (
                <div className="fixed inset-0 bg-[#2e1a14]/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
                    <div className="bg-[#f9f7f2] rounded-[3.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-[#c5a059]/40 flex flex-col relative">
                         <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                         
                         <div className="bg-[#2e1a14] p-8 flex justify-between items-center relative z-10">
                              <h2 className="text-2xl font-bold text-[#f5f5dc] tracking-tight">Yeni Masa Ekle</h2>
                              <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-[#c5a059] hover:bg-black/40 transition-colors">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                         </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8 relative z-10">
                            <div>
                                <label className="block text-[10px] font-bold text-[#c5a059] mb-4 uppercase tracking-[0.2em] text-center">Masa Numarası veya Adı</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-[#c5a059]/20 rounded-3xl px-6 py-6 focus:border-[#c5a059] outline-none font-bold text-[#2e1a14] shadow-inner text-center text-3xl tracking-widest"
                                    value={currentTable.tableNumber}
                                    placeholder="01"
                                    onChange={(e) => setCurrentTable({ ...currentTable, tableNumber: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-[#1a3a2a] hover:bg-[#061e14] text-[#f5f5dc] font-bold rounded-3xl shadow-2xl transition-all border border-[#c5a059]/40 uppercase tracking-widest text-xs"
                                >
                                    {t('admin.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Süslemeler */}
            <div className="absolute bottom-6 left-6 pointer-events-none flex items-end gap-2 z-20">
                 <span className="text-4xl filter drop-shadow-lg">🍅</span>
                 <span className="text-3xl filter drop-shadow-lg opacity-80">🌿</span>
            </div>
        </div>
    );
};

export default AdminTables;