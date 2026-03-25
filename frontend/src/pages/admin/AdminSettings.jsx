import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminSettings = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        restaurant_name: '',
        restaurant_logo: '',
        contact_phone: '',
        contact_address: '',
        home_hero_bg: ''
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            setSettings(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setErrorMessage(t('admin.settingsLoadError'));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await api.put('/settings', settings);
            setSuccessMessage(t('admin.settingsUpdateSuccess'));
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update settings:', error);
            setErrorMessage(error.response?.data?.message || t('admin.settingsUpdateError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col">
            {successMessage && (
                <div className="absolute top-0 left-0 right-0 z-50 bg-[#81c784] text-[#061e14] p-4 text-center font-bold animate-fade-in shadow-lg rounded-xl">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="absolute top-0 left-0 right-0 z-50 bg-red-500 text-white p-4 text-center font-bold animate-fade-in shadow-lg rounded-xl">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="bg-[#f9f7f2] rounded-3xl border border-[#c5a059]/30 shadow-xl p-10 relative overflow-hidden flex-1">
                     <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                     
                     <div className="grid grid-cols-1 gap-8 relative z-10">
                          {/* Restoran Adı */}
                          <div>
                               <label className="block text-sm font-bold text-[#2e1a14] mb-3 uppercase tracking-wider">{t('admin.restaurantName')}</label>
                               <input
                                   type="text"
                                   name="restaurant_name"
                                   value={settings.restaurant_name}
                                   onChange={handleChange}
                                   placeholder="Restoran Adını Giriniz"
                                   className="w-full px-6 py-4 rounded-xl bg-white border border-[#c5a059]/20 focus:border-[#c5a059] focus:ring-0 transition-all font-medium text-[#2e1a14] shadow-inner"
                               />
                          </div>

                          {/* Logo */}
                          <div>
                               <label className="block text-sm font-bold text-[#2e1a14] mb-3 uppercase tracking-wider">{t('admin.logoUrl')}</label>
                               <input
                                   type="text"
                                   name="restaurant_logo"
                                   value={settings.restaurant_logo}
                                   onChange={handleChange}
                                   placeholder="Logo (Emoji veya URL)"
                                   className="w-full px-6 py-4 rounded-xl bg-white border border-[#c5a059]/20 focus:border-[#c5a059] focus:ring-0 transition-all font-medium text-[#2e1a14] shadow-inner"
                               />
                               <p className="text-[10px] text-[#c5a059] mt-2 font-bold opacity-60 uppercase tracking-widest">{t('admin.logoHelp')}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-8">
                               {/* Telefon */}
                               <div>
                                    <label className="block text-sm font-bold text-[#2e1a14] mb-3 uppercase tracking-wider">{t('admin.contactPhone')}</label>
                                    <input
                                        type="text"
                                        name="contact_phone"
                                        value={settings.contact_phone}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-xl bg-white border border-[#c5a059]/20 focus:border-[#c5a059] focus:ring-0 transition-all font-medium text-[#2e1a14] shadow-inner"
                                    />
                               </div>

                               {/* Adres */}
                               <div>
                                    <label className="block text-sm font-bold text-[#2e1a14] mb-3 uppercase tracking-wider">{t('admin.contactAddress')}</label>
                                    <input
                                        type="text"
                                        name="contact_address"
                                        value={settings.contact_address}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 rounded-xl bg-white border border-[#c5a059]/20 focus:border-[#c5a059] focus:ring-0 transition-all font-medium text-[#2e1a14] shadow-inner"
                                    />
                               </div>
                          </div>

                          {/* Arkaplan */}
                          <div>
                               <label className="block text-sm font-bold text-[#2e1a14] mb-3 uppercase tracking-wider">{t('admin.heroBgUrl')}</label>
                               <input
                                   type="text"
                                   name="home_hero_bg"
                                   value={settings.home_hero_bg}
                                   onChange={handleChange}
                                   placeholder="Boş bırakılırsa varsayılan yeşil desen görünür"
                                   className="w-full px-6 py-4 rounded-xl bg-white border border-[#c5a059]/20 focus:border-[#c5a059] focus:ring-0 transition-all font-medium text-[#2e1a14] shadow-inner"
                               />
                          </div>
                     </div>

                     <div className="mt-12 flex justify-end relative z-10">
                          <button
                              type="submit"
                              disabled={loading}
                              className="px-10 py-4 bg-[#1a3a2a] hover:bg-[#061e14] text-[#f5f5dc] font-bold rounded-xl shadow-2xl transition-all disabled:opacity-50 flex items-center gap-3 border border-[#c5a059]/40 group"
                          >
                              {loading ? (
                                  <div className="animate-spin h-5 w-5 border-2 border-[#f5f5dc]/30 border-t-[#f5f5dc] rounded-full"></div>
                              ) : (
                                  <span className="text-xl group-hover:scale-110 transition-transform">⚙️</span>
                              )}
                              <span className="uppercase tracking-[0.2em] text-xs">Ayarları Kaydet</span>
                          </button>
                     </div>

                     {/* Süslemeler - Görsele Sadık Kalınarak */}
                     <div className="absolute bottom-6 left-6 pointer-events-none flex items-end gap-2">
                          <span className="text-4xl filter drop-shadow-lg">🍅</span>
                          <span className="text-3xl filter drop-shadow-lg opacity-80">🌿</span>
                     </div>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;