import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminChangePassword = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setMessage({ text: t('admin.passwordMismatched'), success: false });
            return;
        }
        if (form.newPassword.length < 6) {
            setMessage({ text: t('admin.passwordsRequired'), success: false });
            return;
        }

        setLoading(true);
        try {
            await api.put('/admin/password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setMessage({ text: t('admin.passwordChangeSuccess'), success: true });
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ text: t('admin.passwordChangeError'), success: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col">
            {message && (
                <div className={`absolute top-0 left-0 right-0 z-50 p-4 text-center font-bold animate-fade-in shadow-lg rounded-xl ${message.success ? 'bg-[#81c784] text-[#061e14]' : 'bg-red-500 text-white'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex-1 flex flex-col max-w-2xl">
                <div className="bg-[#f9f7f2] rounded-[2.5rem] border border-[#c5a059]/30 shadow-xl p-10 relative overflow-hidden flex-1">
                     <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                     
                     <div className="space-y-8 relative z-10">
                          {/* Başlık Alanı - Kart İçi */}
                          <div className="flex items-center gap-4 mb-6">
                               <div className="w-10 h-10 bg-[#2e1a14]/10 border border-[#c5a059]/40 rounded-full flex items-center justify-center text-[#c5a059]">✦</div>
                               <h3 className="text-xl font-bold text-[#2e1a14] tracking-tight">{t('admin.changePassword')}</h3>
                          </div>

                          <form onSubmit={handleSubmit} className="space-y-6">
                               {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                                    <div key={field}>
                                        <label className="block text-[10px] font-bold text-[#c5a059] mb-2 uppercase tracking-widest">
                                            {i === 0 ? t('admin.oldPassword') : i === 1 ? t('admin.newPassword') : t('admin.confirmNewPassword')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    field === 'currentPassword' ? (showPasswords.current ? 'text' : 'password') :
                                                        field === 'newPassword' ? (showPasswords.new ? 'text' : 'password') :
                                                            (showPasswords.confirm ? 'text' : 'password')
                                                }
                                                value={form[field]}
                                                onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                                                className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-4 pr-14 focus:border-[#c5a059] focus:ring-0 outline-none font-bold text-[#2e1a14] shadow-inner placeholder:text-[#2e1a14]/20"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleVisibility(field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c5a059] hover:text-[#2e1a14] transition-colors p-2"
                                            >
                                                {(field === 'currentPassword' ? showPasswords.current : field === 'newPassword' ? showPasswords.new : showPasswords.confirm) ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                               ))}

                               <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-10 py-4 bg-[#1a3a2a] hover:bg-[#061e14] text-[#f5f5dc] font-bold rounded-2xl shadow-2xl transition-all disabled:opacity-50 flex items-center gap-3 border border-[#c5a059]/40 group"
                                    >
                                        {loading ? (
                                            <div className="animate-spin h-5 w-5 border-2 border-[#f5f5dc]/30 border-t-[#f5f5dc] rounded-full"></div>
                                        ) : (
                                            <span className="text-xl group-hover:scale-110 transition-transform">🔐</span>
                                        )}
                                        <span className="uppercase tracking-[0.2em] text-xs">Değişiklikleri Kaydet</span>
                                    </button>
                               </div>
                          </form>
                     </div>

                     {/* Süslemeler */}
                     <div className="absolute bottom-6 left-6 pointer-events-none flex items-end gap-2">
                          <span className="text-4xl filter drop-shadow-lg">🍅</span>
                          <span className="text-3xl filter drop-shadow-lg opacity-80">🌿</span>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChangePassword;