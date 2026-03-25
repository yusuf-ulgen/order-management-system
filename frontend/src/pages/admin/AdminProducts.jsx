import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const MOCK_PRODUCTS = [
    { id: 'm1', name: 'Türk Kahvesi', price: 40.00, imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80', available: true, category: { name: 'Kahveler' } },
    { id: 'm2', name: 'Filtre Kahve', price: 50.00, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80', available: true, category: { name: 'Kahveler' } },
    { id: 'm3', name: 'Limonata', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=500&q=80', available: true, category: { name: 'Soğuk İçecekler' } },
];

const AdminProducts = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [imageTab, setImageTab] = useState('url');
    const [uploading, setUploading] = useState(false);

    const [currentProduct, setCurrentProduct] = useState({
        name: '', description: '', price: '', imageUrl: '', available: true, category: { id: '' }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            if (prodRes.data.length === 0) setProducts(MOCK_PRODUCTS);
            else setProducts(prodRes.data);
            setCategories(catRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...currentProduct,
            price: parseFloat(currentProduct.price),
            category: currentProduct.category?.id ? { id: parseInt(currentProduct.category.id) } : null
        };

        try {
            if (currentProduct.id && typeof currentProduct.id !== 'string') {
                const res = await api.put(`/products/${currentProduct.id}`, payload);
                setProducts(products.map(p => p.id === currentProduct.id ? res.data : p));
            } else {
                const res = await api.post('/products', payload);
                setProducts([...products, res.data]);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) { console.error(error); }
        }
    };

    const openEditModal = (product = { name: '', description: '', price: '', imageUrl: '', available: true, category: { id: categories[0]?.id || '' } }) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#c5a059]"></div></div>;

    return (
        <div className="relative h-full flex flex-col mt-[-40px] ml-[-40px] mr-[-40px] mb-[-40px]">
            {/* Koyu Yeşil Zemin Katmanı (Görsele Sadık) */}
            <div className="absolute inset-0 bg-[#0a2e1f] z-0">
                 <div className="absolute inset-0 bg-ornament opacity-10 pointer-events-none"></div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col p-10 overflow-hidden">
                 {/* Header Bar */}
                 <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-[#061e14]/40 border-2 border-[#c5a059] rounded-full flex items-center justify-center">
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f5dc" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                           </div>
                           <h1 className="text-3xl font-bold text-[#f5f5dc] tracking-tight">{t('admin.products')}</h1>
                      </div>
                      <button
                          onClick={() => openEditModal()}
                          className="bg-[#2e1a14] hover:bg-[#3e2723] text-[#f5f5dc] border border-[#c5a059] px-6 py-2.5 rounded-2xl font-bold shadow-2xl transition-all flex items-center gap-2 group"
                      >
                          <span className="text-[#c5a059] group-hover:rotate-90 transition-transform text-xl">+</span>
                          <span className="uppercase tracking-widest text-xs">Yeni Ürün</span>
                      </button>
                 </div>

                 {/* Product Grid */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                          {products.map((product) => (
                              <div key={product.id} className="relative group overflow-hidden rounded-3xl border border-[#c5a059]/30 shadow-2xl transition-all hover:-translate-y-2">
                                   <div className="h-64 relative overflow-hidden">
                                        <img src={product.imageUrl || 'https://via.placeholder.com/500x500?text=Food'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                             <button onClick={() => openEditModal(product)} className="w-10 h-10 bg-[#c5a059] text-[#061e14] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-sm font-bold">✎</button>
                                             <button onClick={() => handleDelete(product.id)} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-sm font-bold">✕</button>
                                        </div>
                                   </div>
                                   <div className="bg-[#2e1a14] p-6 text-center border-t border-[#c5a059]/40 relative">
                                        <div className="absolute inset-0 bg-wood-pattern opacity-10 pointer-events-none"></div>
                                        <h3 className="text-lg font-bold text-[#f5f5dc] tracking-tight relative z-10">{product.name}</h3>
                                        <p className="text-[#c5a059] font-bold text-xl mt-2 relative z-10">
                                            ₺{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                                        </p>
                                   </div>
                              </div>
                          ))}
                      </div>
                 </div>
            </div>

            {/* Modal - Premium Redesign */}
            {isEditing && (
                <div className="fixed inset-0 bg-[#061e14]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-[#f9f7f2] rounded-[2.5rem] shadow-2xl w-full max-w-xl p-10 border border-[#c5a059]/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h2 className="text-2xl font-bold text-[#2e1a14] tracking-tight flex items-center gap-3">
                                <span className="text-[#c5a059]">✦</span>
                                {currentProduct.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="w-10 h-10 border border-[#c5a059]/20 rounded-full flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/10 transition-all">✕</button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-bold text-[#c5a059] mb-2 uppercase tracking-widest">Ürün Adı</label>
                                <input
                                    type="text" required
                                    className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-3.5 focus:border-[#c5a059] focus:ring-0 outline-none font-bold text-[#2e1a14] shadow-inner"
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#c5a059] mb-2 uppercase tracking-widest">Kategori</label>
                                    <select
                                        className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-3.5 focus:border-[#c5a059] focus:ring-0 outline-none font-bold text-[#2e1a14] shadow-inner cursor-pointer"
                                        value={currentProduct.category?.id || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: { id: e.target.value } })}
                                    >
                                        <option value="">Seçiniz</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#c5a059] mb-2 uppercase tracking-widest">Fiyat (₺)</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-3.5 focus:border-[#c5a059] focus:ring-0 outline-none font-bold text-[#2e1a14] shadow-inner"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-[#c5a059] mb-2 uppercase tracking-widest">Görsel URL</label>
                                <input
                                    type="url"
                                    className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-3.5 focus:border-[#c5a059] focus:ring-0 outline-none font-bold text-[#2e1a14] shadow-inner"
                                    value={currentProduct.imageUrl || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-10">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3.5 text-[#2e1a14] font-bold text-xs uppercase tracking-widest">İptal</button>
                                <button type="submit" className="px-10 py-3.5 bg-[#1a3a2a] text-[#f5f5dc] border border-[#c5a059]/40 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#061e14] transition-all">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;