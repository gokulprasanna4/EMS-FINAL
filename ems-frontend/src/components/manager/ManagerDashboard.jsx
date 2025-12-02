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
import { useNotification } from '../../context/NotificationContext';
import ConfirmationModal from '../shared/ConfirmationModal';
import { getDays, formatDate } from '../../utils/helpers'; // Helpers

const ManagerDashboard = ({ currentUser }) => {
    const { notify } = useNotification();
    
    // --- State ---
    const [tab, setTab] = useState('employees');
    const [employees, setEmployees] = useState([]);
    const [requests, setRequests] = useState([]);
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    // Delete Confirmation State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // --- Load Data ---
    const loadData = () => {
        getEmployees()
            .then(res => setEmployees(res.data))
            .catch(() => notify("Failed to load employees", "error"));
            
        getPendingAttendance()
            .then(res => setRequests(res.data))
            .catch(() => notify("Failed to load requests", "error"));
    };

    useEffect(() => { loadData(); }, []);

    // --- Handlers ---

    const handleSaveUser = async (payload) => {
        try {
            if (editingUser) {
                await updateEmployee(editingUser.userId, payload);
                notify("Employee updated successfully", "success");
            } else {
                await createEmployee(payload);
                notify("Employee created successfully", "success");
            }
            setIsModalOpen(false);
            setEditingUser(null);
            loadData();
        } catch (err) {
            notify("Operation failed: " + (err.response?.data?.message || "Server Error"), "error");
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const executeDelete = async () => {
        try {
            await deleteEmployee(deleteId);
            notify("Employee deleted successfully", "success");
            loadData();
        } catch (err) {
            notify("Failed to delete employee", "error");
        }
    };

    const handleAttendance = async (id, status) => {
        const comment = prompt(`Enter comment for ${status}:`) || "";
        try {
            await updateAttendanceStatus(id, status, comment);
            notify(`Request ${status} successfully!`, "success");
            loadData();
        } catch (err) { 
            notify("Failed to update status", "error"); 
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                    Manager Dashboard
                </h1>
                {tab === 'employees' && (
                    <button 
                        onClick={() => { setEditingUser(null); setIsModalOpen(true); }} 
                        className="bg-black dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition"
                    >
                        + Add Employee
                    </button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-8 transition-colors">
                <button 
                    onClick={() => setTab('employees')} 
                    className={`pb-3 px-2 font-semibold text-lg flex items-center gap-2 transition-colors ${
                        tab === 'employees' ? 'border-b-2 border-black dark:border-blue-400 text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    My Employees 
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{employees.length}</span>
                </button>
                <button 
                    onClick={() => setTab('approvals')} 
                    className={`pb-3 px-2 font-semibold text-lg flex items-center gap-2 transition-colors ${
                        tab === 'approvals' ? 'border-b-2 border-black dark:border-blue-400 text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Attendance Approvals
                    {requests.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                            {requests.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content Area */}
            {tab === 'employees' ? (
                <ModernTable 
                    users={employees} 
                    onEdit={(u) => { setEditingUser(u); setIsModalOpen(true); }} 
                    onDelete={handleDelete} 
                />
            ) : (
                <div className="grid gap-4">
                    {requests.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-10">No pending approvals.</p>
                    ) : (
                        requests.map(req => (
                            <div key={req.requestId} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center transition-colors">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                        {req.username} <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(ID: {req.userId})</span>
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                                        <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{req.attendenceType}</span> 
                                        <span className="mx-2 text-gray-400">•</span>
                                        <span className="font-mono">{formatDate(req.startDate)}</span> to <span className="font-mono">{formatDate(req.endDate)}</span>
                                        <span className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-mono border border-gray-200 dark:border-gray-700">
                                            ({getDays(req.startDate, req.endDate)} Days)
                                        </span>
                                    </p>
                                    {req.userRequestComment && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">"{req.userRequestComment}"</p>}
                                </div>
                                <div className="flex gap-3 mt-4 md:mt-0">
                                    <button onClick={() => handleAttendance(req.requestId, 'APPROVED')} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 px-4 py-2 rounded-lg font-medium transition">Approve</button>
                                    <button onClick={() => handleAttendance(req.requestId, 'REJECTED')} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg font-medium transition">Reject</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modals */}
            <UserFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleSaveUser} 
                initialData={editingUser} 
                title={editingUser ? "Edit Employee" : "Add Employee"} 
                defaultReportingId={currentUser.user.userId} 
            />
            
            <ConfirmationModal 
                isOpen={showDeleteConfirm} 
                onClose={() => setShowDeleteConfirm(false)} 
                onConfirm={executeDelete} 
                title="Delete Employee" 
                message="Are you sure you want to delete this employee? This action cannot be undone." 
                confirmText="Delete" 
                isDanger={true} 
            />
        </div>
    );
};

export default ManagerDashboard;