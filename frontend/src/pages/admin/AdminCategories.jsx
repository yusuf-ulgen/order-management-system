import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminCategories = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentCategory.id) {
                const res = await api.put(`/categories/${currentCategory.id}`, currentCategory);
                setCategories(categories.map(c => c.id === currentCategory.id ? res.data : c));
            } else {
                const res = await api.post('/categories', currentCategory);
                setCategories([...categories, res.data]);
            }
            setIsEditing(false);
            setCurrentCategory({ name: '', description: '' });
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.confirmDeleteCategory'))) {
            try {
                await api.delete(`/categories/${id}`);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const openEditModal = (category = { name: '', description: '' }) => {
        setCurrentCategory(category);
        setIsEditing(true);
    };

    if (loading) return <div className="p-8 text-[#c5a059] font-bold animate-pulse">Yükleniyor...</div>;

    return (
        <div className="relative h-full flex flex-col">
            {/* Header Area - Inside Content */}
            <div className="flex justify-between items-center mb-10 relative z-10">
                 <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#2e1a14]/20 border border-[#c5a059]/40 rounded-full flex items-center justify-center text-[#c5a059] shadow-lg">🍵</div>
                      <h2 className="text-2xl font-bold text-[#2e1a14] tracking-tight">Kategoriler</h2>
                 </div>
                 <button
                    onClick={() => openEditModal()}
                    className="px-8 py-3 bg-[#2e1a14] hover:bg-[#1a0f0b] text-[#f5f5dc] font-bold rounded-2xl shadow-xl transition-all border border-[#c5a059]/40 flex items-center gap-3 group"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform">+</span>
                    <span className="uppercase tracking-widest text-[10px]">Yeni Kategori Ekle</span>
                </button>
            </div>

            <div className="flex-1 bg-[#f9f7f2] rounded-[2.5rem] border border-[#c5a059]/30 shadow-2xl relative overflow-hidden flex flex-col">
                 <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                 
                 <div className="relative z-10 overflow-auto flex-1">
                      <table className="w-full border-collapse">
                           <thead>
                                <tr className="bg-[#2e1a14] text-[#c5a059]">
                                     <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em]">{t('admin.categoryName')}</th>
                                     <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em]">{t('admin.description')}</th>
                                     <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em]">{t('admin.actions')}</th>
                                </tr>
                           </thead>
                           <tbody className="divide-y divide-[#c5a059]/10">
                                {categories.map((category) => (
                                     <tr key={category.id} className="group hover:bg-[#2e1a14]/5 transition-colors">
                                          <td className="px-8 py-6">
                                               <div className="font-bold text-[#2e1a14] text-lg">{category.name}</div>
                                          </td>
                                          <td className="px-8 py-6">
                                               <div className="text-[#2e1a14]/60 font-medium italic">{category.description || '-'}</div>
                                          </td>
                                          <td className="px-8 py-6 text-right space-x-6">
                                               <button
                                                   onClick={() => openEditModal(category)}
                                                   className="text-[#1a3a2a] hover:text-[#061e14] font-bold text-sm uppercase tracking-widest border-b border-transparent hover:border-[#1a3a2a] transition-all"
                                               >
                                                   {t('admin.edit')}
                                               </button>
                                               <button
                                                   onClick={() => handleDelete(category.id)}
                                                   className="text-red-800 hover:text-red-950 font-bold text-sm uppercase tracking-widest border-b border-transparent hover:border-red-800 transition-all"
                                               >
                                                   {t('admin.delete')}
                                               </button>
                                          </td>
                                     </tr>
                                ))}
                                {categories.length === 0 && (
                                     <tr>
                                          <td colSpan="3" className="px-8 py-20 text-center text-[#2e1a14]/40 font-bold italic text-xl">
                                               Henüz kategori eklenmemiş.
                                          </td>
                                     </tr>
                                )}
                           </tbody>
                      </table>
                 </div>

                 {/* Süslemeler - Görseldeki Çizimler */}
                 <div className="h-24 border-t border-[#c5a059]/20 flex items-center justify-center gap-12 opacity-10 filter grayscale pointer-events-none">
                      <span className="text-4xl text-[#2e1a14]">🍽️</span>
                      <span className="text-4xl text-[#2e1a14]">🧑‍🍳</span>
                      <span className="text-4xl text-[#2e1a14]">🍷</span>
                      <span className="text-4xl text-[#2e1a14]">🍰</span>
                 </div>
            </div>

            {/* Modal - Premium Re-design */}
            {isEditing && (
                <div className="fixed inset-0 bg-[#2e1a14]/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
                    <div className="bg-[#f9f7f2] rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-[#c5a059]/40 flex flex-col relative">
                         <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                         
                         <div className="bg-[#2e1a14] p-8 flex justify-between items-center relative z-10">
                              <h2 className="text-2xl font-bold text-[#f5f5dc] tracking-tight">
                                  {currentCategory.id ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
                              </h2>
                              <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-[#c5a059] hover:bg-black/40 transition-colors">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </button>
                         </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8 relative z-10">
                            <div>
                                <label className="block text-[10px] font-bold text-[#c5a059] mb-2 uppercase tracking-[0.2em]">{t('admin.categoryName')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-4 focus:border-[#c5a059] outline-none font-bold text-[#2e1a14] shadow-inner"
                                    value={currentCategory.name}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#c5a059] mb-2 uppercase tracking-[0.2em]">{t('admin.description')}</label>
                                <textarea
                                    className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-4 focus:border-[#c5a059] outline-none font-bold text-[#2e1a14] shadow-inner"
                                    rows="4"
                                    value={currentCategory.description || ''}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-12 py-4 bg-[#1a3a2a] hover:bg-[#061e14] text-[#f5f5dc] font-bold rounded-2xl shadow-2xl transition-all border border-[#c5a059]/40 uppercase tracking-widest text-xs"
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

export default AdminCategories;