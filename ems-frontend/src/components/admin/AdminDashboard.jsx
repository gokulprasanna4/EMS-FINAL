import React, { useState, useEffect } from 'react';
import { 
    getManagers, 
    createManager, 
    updateManager, 
    deleteManager, 
    getAllFeedbacks, 
    getAllInfoRequests, 
    resolveInfoRequest 
} from '../../services/api';
import ModernTable from '../shared/ModernTable';
import UserFormModal from '../shared/UserFormModal';
import { useNotification } from '../../context/NotificationContext';
import ConfirmationModal from '../shared/ConfirmationModal';

const AdminDashboard = ({ currentUser }) => {
    const { notify } = useNotification();
    
    // --- State ---
    const [tab, setTab] = useState('managers');
    const [managers, setManagers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [infoRequests, setInfoRequests] = useState([]);
    
    // Modal States
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    // Delete Confirmation State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // --- Load Data ---
    const loadData = () => {
        getManagers().then(res => setManagers(res.data)).catch(() => notify("Failed to load managers", "error"));
        getAllFeedbacks().then(res => setFeedbacks(res.data)).catch(() => notify("Failed to load feedbacks", "error"));
        getAllInfoRequests().then(res => setInfoRequests(res.data)).catch(() => notify("Failed to load info requests", "error"));
    };

    useEffect(() => { loadData(); }, []);

    // --- Handlers ---

    const handleSaveUser = async (payload) => {
        try {
            if (editingUser) await updateManager(editingUser.userId, payload);
            else await createManager(payload);
            setModalOpen(false); 
            loadData(); 
            notify("Manager saved successfully", "success");
        } catch (err) { 
            notify("Error: " + (err.response?.data?.message || "Server Error"), "error"); 
        }
    };

    // 1. Trigger Delete Modal
    const handleDelete = (id) => { 
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    // 2. Execute Delete
    const executeDelete = async () => {
        try {
            await deleteManager(deleteId);
            notify("Manager deleted successfully", "success");
            loadData();
        } catch (err) {
            notify("Failed to delete manager", "error");
        }
    };

    const handleResolve = (id) => {
        if(window.confirm("Mark as resolved?")) { // You can replace this with another ConfirmationModal if desired
            resolveInfoRequest(id)
                .then(() => { loadData(); notify("Request marked as resolved", "success"); })
                .catch(() => notify("Failed to update", "error"));
        }
    };

    // --- Counts ---
    const pendingInfoCount = infoRequests.filter(i => i.status !== 'RESOLVED').length;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Admin Dashboard</h1>
                {tab === 'managers' && (
                    <button 
                        onClick={() => { setEditingUser(null); setModalOpen(true); }} 
                        className="bg-black dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition"
                    >
                        + Add Manager
                    </button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-8 transition-colors">
                <button 
                    onClick={() => setTab('managers')} 
                    className={`pb-3 px-2 font-semibold text-lg flex items-center gap-2 transition-colors ${
                        tab === 'managers' ? 'border-b-2 border-black dark:border-blue-400 text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Managers 
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{managers.length}</span>
                </button>
                <button 
                    onClick={() => setTab('feedbacks')} 
                    className={`pb-3 px-2 font-semibold text-lg flex items-center gap-2 transition-colors ${
                        tab === 'feedbacks' ? 'border-b-2 border-black dark:border-blue-400 text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Feedbacks 
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{feedbacks.length}</span>
                </button>
                <button 
                    onClick={() => setTab('info')} 
                    className={`pb-3 px-2 font-semibold text-lg flex items-center gap-2 transition-colors ${
                        tab === 'info' ? 'border-b-2 border-black dark:border-blue-400 text-black dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Info Requests 
                    {pendingInfoCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">{pendingInfoCount}</span>}
                </button>
            </div>

            {/* --- Content Area --- */}
            
            {/* 1. Managers Tab */}
            {tab === 'managers' && (
                <ModernTable 
                    users={managers} 
                    onEdit={(u) => { setEditingUser(u); setModalOpen(true); }} 
                    onDelete={handleDelete} 
                />
            )}
            
            {/* 2. Feedbacks Tab */}
            {tab === 'feedbacks' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {feedbacks.map(f => (
                        <div key={f.feedbackId} className="bg-white dark:bg-[#1e1e1e] p-6 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-colors hover:shadow-md">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                                        {f.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{f.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {f.userId}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm italic leading-relaxed">"{f.feedback}"</p>
                            </div>
                        </div>
                    ))}
                    {feedbacks.length === 0 && <p className="col-span-full text-center py-10 text-gray-500">No feedback received.</p>}
                </div>
            )}

            {/* 3. Info Requests Tab */}
            {tab === 'info' && (
                <div className="space-y-4">
                    {infoRequests.map(i => (
                        <div key={i.infoRequestId} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center transition-colors">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h5 className="font-bold text-lg text-gray-900 dark:text-white">{i.requestType}</h5>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${
                                        i.status === 'RESOLVED' 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                                    }`}>
                                        {i.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{i.requestDescription}</p>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <span>Requested by:</span>
                                    <span className="font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{i.username} (ID: {i.userId})</span>
                                </div>
                            </div>
                            {i.status !== 'RESOLVED' && (
                                <button 
                                    onClick={() => handleResolve(i.infoRequestId)} 
                                    className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                                >
                                    <span>✓</span> Mark Resolved
                                </button>
                            )}
                        </div>
                    ))}
                    {infoRequests.length === 0 && <p className="text-center py-10 text-gray-500">No info requests found.</p>}
                </div>
            )}

            {/* Create/Edit Modal (with Default ID) */}
            <UserFormModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                onSubmit={handleSaveUser} 
                initialData={editingUser} 
                title={editingUser ? "Edit Manager" : "Add Manager"} 
                defaultReportingId={currentUser.user.userId} 
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal 
                isOpen={showDeleteConfirm} 
                onClose={() => setShowDeleteConfirm(false)} 
                onConfirm={executeDelete} 
                title="Delete Manager" 
                message="Are you sure you want to delete this manager? This action cannot be undone." 
                confirmText="Delete" 
                isDanger={true} 
            />
        </div>
    );
};

export default AdminDashboard;