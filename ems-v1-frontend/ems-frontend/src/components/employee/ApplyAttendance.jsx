import React, { useState } from 'react';
import { applyAttendance } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ApplyAttendance = ({ currentUser }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ attendenceType: 'ATTENDENCE', startDate: '', endDate: '', userRequestComment: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await applyAttendance(currentUser.user.userId, form);
        navigate("/employee");
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Apply Attendance / Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select 
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={form.attendenceType} 
                        onChange={e => setForm({...form, attendenceType: e.target.value})}
                    >
                        <option value="ATTENDENCE">Attendance</option>
                        <option value="LEAVE">Leave</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" className="mt-1 w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border focus:ring-blue-500" onChange={e => setForm({...form, startDate: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" className="mt-1 w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border focus:ring-blue-500" onChange={e => setForm({...form, endDate: e.target.value})} required/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <textarea 
                        className="mt-1 w-full border-gray-300 rounded-md shadow-sm px-3 py-2 border focus:ring-blue-500" 
                        rows="3"
                        onChange={e => setForm({...form, userRequestComment: e.target.value})}
                    ></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium">
                    Submit Request
                </button>
            </form>
        </div>
    );
};
export default ApplyAttendance;