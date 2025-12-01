import React, { useState, useEffect } from 'react';

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {
    if (!isOpen) return null;
    return <UserFormContent onClose={onClose} onSubmit={onSubmit} initialData={initialData} title={title} />;
};

const UserFormContent = ({ onClose, onSubmit, initialData, title }) => {
    const [formData, setFormData] = useState({
        username: '', password: '', reportingId: '',
        mobileNumber: '', age: '', joiningDate: '', experience: '',
        department: 'IT', employmentType: 'FULL_TIME'
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
                employmentType: initialData.employmentType || 'FULL_TIME'
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Basic Info */}
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelClass}>Username</label>
                        <input name="username" className={inputClass} value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelClass}>Password {initialData && "(Leave blank to keep)"}</label>
                        <input name="password" type="password" className={inputClass} value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="col-span-2">
                        <label className={labelClass}>Reports To (ID)</label>
                        <input name="reportingId" type="number" className={inputClass} value={formData.reportingId} onChange={handleChange} />
                    </div>

                    {/* Personal Details */}
                    <div>
                        <label className={labelClass}>Mobile</label>
                        <input name="mobileNumber" className={inputClass} value={formData.mobileNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <label className={labelClass}>Age</label>
                        <input name="age" type="number" className={inputClass} value={formData.age} onChange={handleChange} />
                    </div>

                    {/* Employment Details */}
                    <div>
                        <label className={labelClass}>Joining Date</label>
                        <input name="joiningDate" type="date" className={inputClass} value={formData.joiningDate} onChange={handleChange} />
                    </div>
                    <div>
                        <label className={labelClass}>Experience (Years)</label>
                        <input name="experience" type="number" step="0.1" className={inputClass} value={formData.experience} onChange={handleChange} />
                    </div>

                    {/* Dropdowns */}
                    <div>
                        <label className={labelClass}>Department</label>
                        <select name="department" className={inputClass} value={formData.department} onChange={handleChange}>
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
                        <select name="employmentType" className={inputClass} value={formData.employmentType} onChange={handleChange}>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="FREELANCE">Freelance</option>
                        </select>
                    </div>

                    <div className="col-span-2 mt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition">Cancel</button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition">Save Details</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UserFormModal;