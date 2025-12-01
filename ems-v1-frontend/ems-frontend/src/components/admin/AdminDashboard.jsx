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

const AdminDashboard = () => {
    const [tab, setTab] = useState('managers'); // 'managers', 'feedbacks', 'info'
    const [managers, setManagers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [infoRequests, setInfoRequests] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const loadData = () => {
        getManagers().then(res => setManagers(res.data)).catch(console.error);
        getAllFeedbacks().then(res => setFeedbacks(res.data)).catch(console.error);
        getAllInfoRequests().then(res => setInfoRequests(res.data)).catch(console.error);
    };

    useEffect(() => { loadData(); }, []);

    // --- Handlers ---
    const handleSaveUser = async (payload) => {
        try {
            if (editingUser) await updateManager(editingUser.userId, payload);
            else await createManager(payload);
            setModalOpen(false); loadData(); alert("Success");
        } catch (err) { 
            alert("Error: " + (err.response?.data?.message || "Server Error")); 
        }
    };

    const handleDelete = (id) => { 
        if(window.confirm("Delete this manager?")) deleteManager(id).then(loadData); 
    };

    const handleResolve = (id) => {
        if(window.confirm("Mark this request as resolved?")) resolveInfoRequest(id).then(loadData);
    };

    const openCreateModal = () => { setEditingUser(null); setModalOpen(true); };
    const openEditModal = (user) => { setEditingUser(user); setModalOpen(true); };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                    Admin Dashboard
                </h1>
                {tab === 'managers' && (
                    <button 
                        onClick={openCreateModal} 
                        className="bg-black dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
                    >
                        + Add Manager
                    </button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-8 transition-colors">
                {[
                    { id: 'managers', label: 'Managers' },
                    { id: 'feedbacks', label: 'User Feedbacks' },
                    { id: 'info', label: 'Info Requests' }
                ].map((t) => (
                    <button 
                        key={t.id} 
                        onClick={() => setTab(t.id)} 
                        className={`pb-3 px-2 capitalize font-semibold text-lg transition-colors duration-200 ${
                            tab === t.id 
                            ? 'border-b-2 border-black dark:border-blue-400 text-black dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* --- Content Area --- */}
            
            {/* TAB 1: MANAGERS */}
            {tab === 'managers' && (
                <ModernTable 
                    users={managers} 
                    onEdit={openEditModal} 
                    onDelete={handleDelete} 
                />
            )}
            
            {/* TAB 2: FEEDBACKS */}
            {tab === 'feedbacks' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {feedbacks.map(f => (
                        <div key={f.feedbackId} className="bg-white dark:bg-[#1e1e1e] p-6 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-colors duration-200 hover:shadow-md">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                                        {f.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{f.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {f.userId}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                                    "{f.feedback}"
                                </p>
                            </div>
                        </div>
                    ))}
                    {feedbacks.length === 0 && <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">No feedback received.</p>}
                </div>
            )}

            {/* TAB 3: INFO REQUESTS */}
            {tab === 'info' && (
                <div className="space-y-4">
                    {infoRequests.map(i => (
                        <div key={i.infoRequestId} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center transition-colors duration-200">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h5 className="font-bold text-lg text-gray-900 dark:text-white">{i.requestType}</h5>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                        i.status === 'RESOLVED' 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                                    }`}>
                                        {i.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{i.requestDescription}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Requested by:</span>
                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                                        {i.username} (ID: {i.userId})
                                    </span>
                                </div>
                            </div>
                            
                            {i.status !== 'RESOLVED' && (
                                <button 
                                    onClick={() => handleResolve(i.infoRequestId)} 
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors duration-200 flex items-center gap-2"
                                >
                                    <span className="text-lg">✓</span> Mark Resolved
                                </button>
                            )}
                        </div>
                    ))}
                    {infoRequests.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-10">No info requests found.</p>}
                </div>
            )}

            {/* Create/Edit Modal */}
            <UserFormModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                onSubmit={handleSaveUser} 
                initialData={editingUser} 
                title={editingUser ? "Edit Manager" : "Add Manager"} 
            />
        </div>
    );
};

export default AdminDashboard;