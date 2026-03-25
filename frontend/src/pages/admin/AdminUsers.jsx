import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminUsers = () => {
    const { t } = useTranslation();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/admin/users');
            setStaffList(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setSaving(true);
        try {
            await api.post('/admin/users', form);
            setSuccess(`✅ "${form.username}" ${t('admin.successAccountCreated') || 'account created!'}`);
            setForm({ username: '', password: '' });
            fetchStaff();
        } catch (err) {
            setError(err.response?.data?.message || t('admin.errorAccountCreate') || 'Failed to create account.');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id, username) => {
        if (!window.confirm(t('admin.confirmDeactivate', { username }))) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setStaffList(prev => prev.filter(u => u.id !== id));
        } catch (e) { alert(t('admin.deactivateError')); }
    };

    return (
        <div className="relative h-full flex flex-col space-y-8">
            {/* Header Area */}
            <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-[#2e1a14]/20 border border-[#c5a059]/40 rounded-full flex items-center justify-center text-[#c5a059] shadow-lg">👥</div>
                      <h2 className="text-2xl font-bold text-[#2e1a14] tracking-tight">{t('admin.userManagement')}</h2>
                 </div>
                 <p className="text-[#2e1a14]/60 font-medium ml-16">Personel hesaplarını yönetin ve yeni yetkililer ekleyin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1 relative z-10 pb-20">
                {/* Add Staff Form - Beige Textured Card */}
                <div className="bg-[#f9f7f2] rounded-[3.5rem] shadow-2xl overflow-hidden border-2 border-[#2e1a14] flex flex-col relative group">
                     <div className="absolute inset-0 bg-ornament opacity-5 pointer-events-none"></div>
                     
                     <div className="p-10 space-y-8 relative z-10">
                          <div className="flex items-center gap-3">
                               <span className="text-xl">👤</span>
                               <h3 className="font-bold text-[#2e1a14] text-xl tracking-tight">{t('admin.addNewStaff')}</h3>
                          </div>

                          <form onSubmit={handleAdd} className="space-y-6">
                              <div>
                                  <label className="block text-[10px] font-bold text-[#c5a059] mb-3 uppercase tracking-[0.2em]">{t('admin.staffUsername')}</label>
                                  <input
                                      type="text" required
                                      value={form.username}
                                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                      className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-4 focus:border-[#c5a059] outline-none text-[#2e1a14] font-bold shadow-inner"
                                      placeholder="kullaniciadi"
                                  />
                              </div>

                              <div>
                                  <label className="block text-[10px] font-bold text-[#c5a059] mb-3 uppercase tracking-[0.2em]">{t('admin.staffPassword')}</label>
                                  <div className="relative">
                                      <input
                                          type={showPassword ? 'text' : 'password'} required
                                          value={form.password}
                                          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                          className="w-full bg-white border border-[#c5a059]/20 rounded-2xl px-6 py-4 pr-16 focus:border-[#c5a059] outline-none text-[#2e1a14] font-bold shadow-inner"
                                          placeholder="••••••••"
                                          minLength={6}
                                      />
                                      <button
                                          type="button"
                                          onClick={() => setShowPassword(!showPassword)}
                                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/10 rounded-full transition-colors"
                                      >
                                          {showPassword ? '👁️' : '🕶️'}
                                      </button>
                                  </div>
                              </div>

                              {error && <p className="text-red-700 text-xs font-bold bg-red-100 p-4 rounded-2xl border border-red-200">❌ {error}</p>}
                              {success && <p className="text-green-800 text-xs font-bold bg-green-100 p-4 rounded-2xl border border-green-200">{success}</p>}

                              <button type="submit" disabled={saving}
                                  className="w-full bg-[#1a3a2a] hover:bg-[#061e14] text-[#f5f5dc] py-5 rounded-2xl font-bold shadow-xl transition-all border border-[#c5a059]/40 uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                              >
                                  <span>{saving ? '⏳' : '+'}</span>
                                  <span>{saving ? t('admin.adding') : t('admin.addStaff')}</span>
                              </button>
                          </form>

                          <div className="bg-[#2e1a14]/5 rounded-2xl p-4 border border-[#2e1a14]/10 flex items-start gap-3">
                               <span className="text-lg">💡</span>
                               <p className="text-[10px] text-[#2e1a14]/50 font-medium leading-relaxed uppercase tracking-wider">
                                    {t('admin.staffHint')}
                               </p>
                          </div>
                     </div>
                </div>

                {/* Staff List - Dark Glass Area */}
                <div className="bg-black/30 rounded-[3.5rem] border border-white/5 p-10 flex flex-col shadow-2xl backdrop-blur-sm relative">
                    <div className="flex items-center gap-3 mb-8">
                         <span className="text-xl">📋</span>
                         <h3 className="font-bold text-[#f5f5dc] text-xl tracking-tight">{t('admin.existingStaff')}</h3>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-[#c5a059] font-bold animate-pulse uppercase tracking-widest text-xs">{t('admin.loading')}</div>
                    ) : (
                        <div className="flex-1 overflow-auto space-y-4 pr-4 custom-scrollbar">
                            {staffList.map(user => (
                                <div key={user.id} className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-[2rem] px-8 py-5 border border-white/5 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#c5a059]/20 rounded-full flex items-center justify-center text-[#c5a059] border border-[#c5a059]/30 font-bold uppercase">
                                             {user.username.charAt(0)}
                                        </div>
                                        <div>
                                             <span className="font-bold text-[#f5f5dc] tracking-tight">{user.username}</span>
                                             <span className="ml-3 text-[9px] px-3 py-1 rounded-full bg-[#1a3a2a] text-[#aed581] border border-[#aed581]/30 font-bold uppercase tracking-widest">STAFF</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(user.id, user.username)}
                                        className="w-10 h-10 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded-full flex items-center justify-center transition-all border border-red-900/20 shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            ))}
                            {staffList.length === 0 && (
                                <div className="text-center py-32 opacity-20 filter grayscale">
                                    <span className="text-6xl mb-6 block">👥</span>
                                    <p className="font-bold text-[#f5f5dc] uppercase tracking-widest text-xs">{t('admin.noStaff')}</p>
                                </div>
                            )}
                        </div>
                    )}
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

export default AdminUsers;