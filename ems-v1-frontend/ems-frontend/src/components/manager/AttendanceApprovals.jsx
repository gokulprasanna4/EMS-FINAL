import React, { useState, useEffect } from 'react';
import { getManagers, createManager, updateManager, deleteManager, getAllFeedbacks, getAllInfoRequests, resolveInfoRequest } from '../../services/api';
import UserTable from '../shared/UserTable';
import UserFormModal from '../shared/UserFormModal';

const AdminDashboard = () => {
    const [tab, setTab] = useState('managers');
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

    const handleSaveUser = async (payload) => {
        try {
            if (editingUser) await updateManager(editingUser.userId, payload);
            else await createManager(payload);
            setModalOpen(false); loadData(); alert("Success");
        } catch (err) { alert("Error: " + (err.response?.data?.message || "Server Error")); }
    };

    const handleDelete = (id) => { if(confirm("Delete?")) deleteManager(id).then(loadData); };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                {tab === 'managers' && <button onClick={() => { setEditingUser(null); setModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded shadow">+ Add Manager</button>}
            </div>

            <div className="flex space-x-4 border-b mb-6 overflow-x-auto">
                {['managers', 'feedbacks', 'info'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`py-2 px-4 capitalize font-semibold whitespace-nowrap ${tab===t?'border-b-2 border-blue-600 text-blue-600':'text-gray-500'}`}>{t === 'info' ? 'Info Requests' : t}</button>
                ))}
            </div>

            {tab === 'managers' && <UserTable users={managers} onEdit={(u) => { setEditingUser(u); setModalOpen(true); }} onDelete={handleDelete} />}
            
            {tab === 'feedbacks' && <div className="grid gap-4">{feedbacks.map(f => <div key={f.feedbackId} className="bg-white p-4 shadow rounded border-l-4 border-purple-500">"{f.feedback}" <div className="text-xs text-gray-500 mt-1">From User ID: {f.userId}</div></div>)}</div>}

            {tab === 'info' && <div className="space-y-4">{infoRequests.map(i => <div key={i.infoRequestId} className="bg-white p-4 shadow rounded flex justify-between items-center"><div><h5 className="font-bold">{i.requestType}</h5><p className="text-gray-600">{i.requestDescription}</p><span className={`text-xs px-2 py-1 rounded ${i.status==='RESOLVED'?'bg-green-100 text-green-800':'bg-yellow-100 text-yellow-800'}`}>{i.status}</span></div>{i.status !== 'RESOLVED' && <button onClick={() => resolveInfoRequest(i.infoRequestId).then(loadData)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Resolve</button>}</div>)}</div>}

            <UserFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSaveUser} initialData={editingUser} title={editingUser ? "Edit Manager" : "Add Manager"} />
        </div>
    );
};
export default AdminDashboard;