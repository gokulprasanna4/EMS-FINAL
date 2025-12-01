import React, { useState, useEffect } from 'react';
import { updateMyProfile } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Icons ---
const SaveIcon = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const LockResetIcon = () => <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>;
const UserIcon = () => <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const SecurityIcon = () => <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>;

const ProfilePage = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Default to 'profile' (Details) view if no state is passed
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');

    // Sync tab when location changes (deep linking from dropdown)
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    const [formData, setFormData] = useState({
        ...currentUser.user,
        password: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, password: '' }; 
            await updateMyProfile(currentUser.user.userId, payload);
            alert("✅ Profile Updated Successfully!");
        } catch (err) {
            alert("Error: " + (err.response?.data || "Update Failed"));
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if(!formData.password) return alert("Please enter a password.");
        try {
            await updateMyProfile(currentUser.user.userId, formData);
            alert("🔒 Password Changed!");
            setFormData(prev => ({...prev, password: ''}));
        } catch (err) {
            alert("Error: " + (err.response?.data || "Failed"));
        }
    };

    const handleLogout = () => {
        if(window.confirm("Are you sure you want to log out?")) {
            onLogout();
            navigate('/login');
        }
    };

    // --- Styling ---
    const cardClass = "bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors h-full";
    const navItemClass = (tab) => `w-full text-left px-6 py-4 flex items-center font-medium transition-colors ${activeTab === tab ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252525]'}`;
    const labelClass = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2";
    const inputClass = "w-full p-2.5 bg-gray-50 dark:bg-[#2b2b2b] border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all";
    const disabledInputClass = "w-full p-2.5 bg-gray-100 dark:bg-gray-800/50 border border-transparent rounded-lg text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed";

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- LEFT SIDEBAR (Identity + Navigation) --- */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className={cardClass}>
                        {/* User Identity */}
                        <div className="p-6 flex flex-col items-center text-center border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5">
                            <div className="w-20 h-20 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-3xl font-bold text-white mb-3 shadow-lg">
                                {formData.username.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.username}</h2>
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase">{formData.role}</span>
                                <span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">ID: {formData.userId}</span>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="py-2">
                            <button onClick={() => setActiveTab('profile')} className={navItemClass('profile')}>
                                <UserIcon /> Profile Details
                            </button>
                            <button onClick={() => setActiveTab('security')} className={navItemClass('security')}>
                                <SecurityIcon /> Security
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-auto">
                            <button onClick={handleLogout} className="w-full text-left px-6 py-4 flex items-center font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                <LogoutIcon /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT CONTENT AREA --- */}
                <div className="lg:col-span-8">
                    
                    {/* TAB 1: Profile Details Form */}
                    {activeTab === 'profile' && (
                        <div className={cardClass}>
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your personal information and employment details.</p>
                            </div>
                            
                            <form onSubmit={handleUpdateDetails} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Read Only */}
                                <div>
                                    <label className={labelClass}>Username</label>
                                    <input disabled value={formData.username} className={disabledInputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>User ID</label>
                                    <input disabled value={formData.userId} className={disabledInputClass} />
                                </div>

                                {/* Editable */}
                                <div>
                                    <label className={labelClass}>Mobile</label>
                                    <input name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleChange} className={inputClass} placeholder="+91..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Age</label>
                                    <input name="age" type="number" value={formData.age || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Department</label>
                                    <select name="department" value={formData.department || 'IT'} onChange={handleChange} className={inputClass}>
                                        <option value="IT">IT</option>
                                        <option value="DEVELOPMENT">Development</option>
                                        <option value="MANAGEMENT">Management</option>
                                        <option value="HR">HR</option>
                                        <option value="LD">L&D</option>
                                        <option value="FINANCE">Finance</option>
                                        <option value="MARKETING">Marketing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Employment Type</label>
                                    <select name="employmentType" value={formData.employmentType || 'FULL_TIME'} onChange={handleChange} className={inputClass}>
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACT">Contract</option>
                                        <option value="FREELANCE">Freelance</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Experience (Years)</label>
                                    <input name="experience" type="number" step="0.1" value={formData.experience || ''} onChange={handleChange} className={inputClass} />
                                </div>

                                <div className="md:col-span-2 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                                    <button className="flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md active:scale-95">
                                        <SaveIcon /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB 2: Security Form */}
                    {activeTab === 'security' && (
                        <div className={cardClass}>
                            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security & Password</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ensure your account is using a strong password.</p>
                            </div>
                            
                            <form onSubmit={handleUpdatePassword} className="p-8">
                                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-6 mb-6">
                                    <label className="block text-sm font-bold text-yellow-800 dark:text-yellow-500 mb-2">New Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        placeholder="••••••••" 
                                        className="w-full p-3 bg-white dark:bg-[#2b2b2b] border border-yellow-200 dark:border-yellow-800/50 rounded-lg focus:ring-2 focus:ring-yellow-500/50 outline-none text-gray-900 dark:text-white transition-all"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Make sure it's at least 8 characters long.</p>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button className="flex items-center bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md active:scale-95">
                                        <LockResetIcon /> Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;