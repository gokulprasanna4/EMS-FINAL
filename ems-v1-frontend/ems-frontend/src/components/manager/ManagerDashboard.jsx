import React, { useState, useEffect } from 'react';
import { 
    getEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    getPendingAttendance, 
    updateAttendanceStatus 
} from '../../services/api';
import ModernTable from '../shared/ModernTable';
import UserFormModal from '../shared/UserFormModal';

const getDays = (start, end) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
};

const ManagerDashboard = () => {
    const [tab, setTab] = useState('employees');
    const [employees, setEmployees] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const loadData = () => {
        getEmployees().then(res => setEmployees(res.data)).catch(console.error);
        getPendingAttendance().then(res => setRequests(res.data)).catch(console.error);
    };

    useEffect(() => { loadData(); }, []);

    const handleSaveUser = async (payload) => {
        try {
            if (editingUser) {
                await updateEmployee(editingUser.userId, payload);
                alert("Updated successfully");
            } else {
                await createEmployee(payload);
                alert("Created successfully");
            }
            setIsModalOpen(false);
            setEditingUser(null);
            loadData();
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || "Server Error"));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete employee?")) {
            try { await deleteEmployee(id); loadData(); } 
            catch (err) { alert("Failed to delete"); }
        }
    };

    const handleAttendance = async (id, status) => {
        const comment = prompt(`Comment for ${status}:`) || "";
        try {
            await updateAttendanceStatus(id, status, comment);
            loadData();
        } catch (err) { alert("Error updating status"); }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
                {tab === 'employees' && (
                    <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} 
                        className="bg-black dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition">
                        + Add Employee
                    </button>
                )}
            </div>

            <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-8">
                {['employees', 'approvals'].map(t => (
                    <button key={t} onClick={() => setTab(t)} 
                        className={`pb-3 px-2 capitalize font-semibold text-lg transition-colors ${
                            tab === t 
                            ? 'border-b-2 border-black dark:border-blue-400 text-black dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}>
                        {t}
                    </button>
                ))}
            </div>

            {tab === 'employees' ? (
                <ModernTable users={employees} onEdit={(u) => { setEditingUser(u); setIsModalOpen(true); }} onDelete={handleDelete} />
            ) : (
                <div className="grid gap-4">
                    {requests.map(req => (
                        <div key={req.requestId} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center transition-colors">
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{req.username} <span className="text-gray-400 text-sm font-normal">#{req.userId}</span></h4>
                                <div className="text-gray-600 dark:text-gray-300 mt-1">
                                    <span className="font-medium text-blue-600 dark:text-blue-400 uppercase text-xs tracking-wide">{req.attendenceType}</span>
                                    <span className="mx-2 text-gray-400 dark:text-gray-600">•</span>
                                    <span>{req.startDate} to {req.endDate}</span>
                                    <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">({getDays(req.startDate, req.endDate)} Days)</span>
                                </div>
                                {req.userRequestComment && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">"{req.userRequestComment}"</p>}
                            </div>
                            <div className="flex gap-3 mt-4 md:mt-0">
                                <button onClick={() => handleAttendance(req.requestId, 'APPROVED')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 px-4 py-2 rounded-lg font-medium transition">Approve</button>
                                <button onClick={() => handleAttendance(req.requestId, 'REJECTED')} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg font-medium transition">Reject</button>
                            </div>
                        </div>
                    ))}
                    {requests.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-10">No pending approvals.</p>}
                </div>
            )}

            <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveUser} initialData={editingUser} title={editingUser ? "Edit Employee" : "New Employee"} />
        </div>
    );
};
export default ManagerDashboard;