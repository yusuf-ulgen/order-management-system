import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const CustomerMenu = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const { addToCart, getCartItemCount } = useCart();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tableNumber = queryParams.get('table') || sessionStorage.getItem('tableNumber') || 'Table 1';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products/active')
                ]);
                setCategories(categoriesRes.data);
                setProducts(productsRes.data);
                if (categoriesRes.data.length > 0) {
                    setActiveCategory(Number(categoriesRes.data[0].id));
                }
            } catch (error) {
                console.error("Error fetching menu data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = activeCategory != null
        ? products.filter(p => Number(p.category?.id) === Number(activeCategory))
        : products;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#061e14]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#c5a059]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f7f2] font-serif">
            {/* Header */}
            <header className="bg-[#061e14] p-6 pb-8 sticky top-0 z-20">
                <div className="flex justify-between items-start max-w-4xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Menü</h1>
                        <p className="text-[#c5a059] text-sm mt-1">{tableNumber}</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="border border-[#c5a059]/40 rounded-full px-3 py-1 text-[#c5a059] text-xs font-bold">
                             TR
                         </div>
                         <button className="w-10 h-10 border border-[#c5a059]/40 rounded-full flex items-center justify-center text-[#c5a059]">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                         </button>
                         <button onClick={() => navigate('/cart')} className="relative w-12 h-12 bg-[#eac16e]/90 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e1a14" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                             {getCartItemCount() > 0 && (
                                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                     {getCartItemCount()}
                                 </span>
                             )}
                         </button>
                    </div>
                </div>
            </header>

            {/* Categories */}
            <div className="bg-[#f9f7f2] sticky top-[92px] z-10 border-b border-[#e0dec5]">
                 <div className="max-w-4xl mx-auto flex items-center gap-8 overflow-x-auto px-6 py-4 hide-scrollbar">
                     {categories.map(category => (
                         <button
                             key={category.id}
                             onClick={() => setActiveCategory(Number(category.id))}
                             className={`whitespace-nowrap pb-2 text-sm font-bold tracking-wide transition-all ${
                                 Number(activeCategory) === Number(category.id)
                                 ? 'text-[#061e14] border-b-2 border-[#c5a059]'
                                 : 'text-[#061e14]/40 border-b-2 border-transparent hover:text-[#061e14]/60'
                             }`}
                         >
                             {category.name}
                         </button>
                     ))}
                 </div>
            </div>

            {/* Products */}
            <main className="max-w-4xl mx-auto p-6 grid grid-cols-2 gap-4">
                 {filteredProducts.map(product => (
                     <div key={product.id} className="bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col group pb-4">
                         <div className="relative">
                              <img
                                 src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Food'}
                                 alt={product.name}
                                 className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <button
                                 onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                                 className="absolute -bottom-4 right-4 w-10 h-10 bg-[#eac16e] rounded-full flex items-center justify-center shadow-lg border-2 border-white text-[#2e1a14] active:scale-90 transition-transform z-10"
                              >
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              </button>
                         </div>
                         <div className="px-5 pt-6 flex-1">
                              <h3 className="text-[#061e14] font-bold text-base leading-tight mb-1">{product.name}</h3>
                              <p className="text-[#061e14]/40 text-[10px] mb-2">{activeCategory && categories.find(c => Number(c.id) === Number(activeCategory))?.name}</p>
                              <div className="text-[#c5a059] font-bold text-lg">
                                  ₺{Number(product.price).toFixed(2)}
                              </div>
                         </div>
                     </div>
                 ))}
                 {filteredProducts.length === 0 && (
                     <div className="col-span-2 text-center py-20 text-[#061e14]/40 italic">
                         Bu kategoride ürün bulunamadı.
                     </div>
                 )}
            </main>
        </div>
    );
};

export default CustomerMenu;