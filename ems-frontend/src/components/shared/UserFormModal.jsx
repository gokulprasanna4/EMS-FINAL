import React, { useState, useEffect } from 'react';

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, title, defaultReportingId }) => {
    if (!isOpen) return null;
    return <UserFormContent onClose={onClose} onSubmit={onSubmit} initialData={initialData} title={title} defaultReportingId={defaultReportingId} />;
};

const UserFormContent = ({ onClose, onSubmit, initialData, title, defaultReportingId }) => {
    const [formData, setFormData] = useState({
        username: '', password: '', 
        reportingId: initialData?.reportingId || defaultReportingId || '', 
        mobileNumber: '', age: '', joiningDate: '', experience: '',
        department: 'IT', employmentType: 'FULL_TIME',
        // Defaults for UI display (Backend also has these defaults)
        sickLeaveBalance: 7, 
        casualLeaveBalance: 7, 
        earnedLeaveBalance: 15
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                password: '',
                reportingId: initialData.reportingId || '',
                mobileNumber: initialData.mobileNumber || '',
                age: initialData.age || '',
                joiningDate: initialData.joiningDate || '',
                experience: initialData.experience || '',
                department: initialData.department || 'IT',
                employmentType: initialData.employmentType || 'FULL_TIME',
                // Load existing balances if editing
                sickLeaveBalance: initialData.sickLeaveBalance !== undefined ? initialData.sickLeaveBalance : 7,
                casualLeaveBalance: initialData.casualLeaveBalance !== undefined ? initialData.casualLeaveBalance : 7,
                earnedLeaveBalance: initialData.earnedLeaveBalance !== undefined ? initialData.earnedLeaveBalance : 15,
            });
        }
    }, [initialData]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

    const inputClass = "w-full bg-gray-50 dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded p-2 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors";
    const labelClass = "block text-xs text-gray-500 dark:text-gray-400 mb-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto transition-colors">
                <h3 className="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Basic Info (Full Width) */}
                    <div className="md:col-span-1">
                        <label className={labelClass}>Username</label>
                        <input name="username" className={inputClass} value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="md:col-span-1">
                        <label className={labelClass}>Password {initialData && "(Optional)"}</label>
                        <input name="password" type="password" className={inputClass} value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-1">
                        <label className={labelClass}>Reports To ID</label>
                        <input name="reportingId" type="number" className={inputClass} value={formData.reportingId} onChange={handleChange} placeholder={`Default: ${defaultReportingId||''}`} />
                    </div>

                    {/* Personal Details */}
                    <div><label className={labelClass}>Mobile</label><input name="mobileNumber" className={inputClass} value={formData.mobileNumber} onChange={handleChange} /></div>
                    <div><label className={labelClass}>Age</label><input name="age" type="number" className={inputClass} value={formData.age} onChange={handleChange} /></div>
                    <div><label className={labelClass}>Joining Date</label><input name="joiningDate" type="date" className={inputClass} value={formData.joiningDate} onChange={handleChange} /></div>
                    
                    <div><label className={labelClass}>Experience</label><input name="experience" type="number" step="0.1" className={inputClass} value={formData.experience} onChange={handleChange} /></div>
                    <div>
                        <label className={labelClass}>Department</label>
                        <select name="department" className={inputClass} value={formData.department} onChange={handleChange}>
                            <option value="IT">IT</option><option value="HR">HR</option><option value="FINANCE">Finance</option><option value="MARKETING">Marketing</option><option value="DEVELOPMENT">Development</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Employment</label>
                        <select name="employmentType" className={inputClass} value={formData.employmentType} onChange={handleChange}>
                            <option value="FULL_TIME">Full Time</option><option value="PART_TIME">Part Time</option><option value="CONTRACT">Contract</option>
                        </select>
                    </div>

                    {/* --- LEAVE BALANCE MANAGEMENT (New Section) --- */}
                    <div className="md:col-span-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Leave Balances (Edit to Update)</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">Sick Leave</label>
                                <input name="sickLeaveBalance" type="number" className={inputClass} value={formData.sickLeaveBalance} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Casual Leave</label>
                                <input name="casualLeaveBalance" type="number" className={inputClass} value={formData.casualLeaveBalance} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-green-600 dark:text-green-400 mb-1">Earned Leave</label>
                                <input name="earnedLeaveBalance" type="number" className={inputClass} value={formData.earnedLeaveBalance} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3 mt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition">Cancel</button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition">Save Employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UserFormModal;