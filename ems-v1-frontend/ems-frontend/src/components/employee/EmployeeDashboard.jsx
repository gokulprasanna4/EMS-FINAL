import React, { useState, useEffect } from 'react';
import { applyAttendance, submitFeedback, submitInfoRequest, getMyAttendance, checkAppliedDates } from '../../services/api';

// Helper to calculate days
const getDays = (start, end) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
};

const EmployeeDashboard = ({ currentUser }) => {
    const uid = currentUser.user.userId;
    const [tab, setTab] = useState('history'); 
    const [history, setHistory] = useState([]);
    
    // Form States
    const [att, setAtt] = useState({ attendenceType: 'ATTENDENCE', startDate: '', endDate: '', userRequestComment: '' });
    const [feed, setFeed] = useState('');
    const [info, setInfo] = useState({ requestType: '', requestDescription: '' });
    const [appliedStatus, setAppliedStatus] = useState(null); 

    // Data Loading
    const loadHistory = () => {
        getMyAttendance(uid)
            .then(res => setHistory(res.data))
            .catch(err => console.log("History load error (expected if empty):", err));
    };
    
    useEffect(() => { loadHistory(); }, [uid]);

    // Live Date Validation
    useEffect(() => {
        let isActive = true;
        if (att.startDate && att.endDate) {
            setAppliedStatus('checking');
            const timer = setTimeout(() => {
                checkAppliedDates(uid, att.startDate, att.endDate)
                    .then(res => { if (isActive) setAppliedStatus(res.data === true ? 'applied' : null); })
                    .catch(() => { if (isActive) setAppliedStatus(null); });
            }, 600);
            return () => { isActive = false; clearTimeout(timer); };
        } else {
            setAppliedStatus(null);
        }
    }, [att.startDate, att.endDate, uid]);

    // Handlers
    const handleApply = (e) => { 
        e.preventDefault(); 
        if (appliedStatus === 'applied') return alert("Conflict detected!");
        applyAttendance(uid, att).then(() => { 
            alert("Application Submitted!"); 
            loadHistory(); 
            setAtt({ attendenceType: 'ATTENDENCE', startDate: '', endDate: '', userRequestComment: '' }); 
            setTab('history'); 
        }).catch(err => alert('Failed: ' + (err.response?.data || "Server Error"))); 
    };

    const handleFeedback = (e) => { 
        e.preventDefault(); 
        submitFeedback(uid, { feedback: feed }).then(() => { alert("Feedback Sent!"); setFeed(''); }); 
    };

    const handleInfo = (e) => { 
        e.preventDefault(); 
        submitInfoRequest(uid, info).then(() => { alert("Request Sent!"); setInfo({requestType:'', requestDescription:''}); }); 
    };

    // UI Helpers
    const getStatusBadge = (status) => {
        const config = {
            APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
            REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
            PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
        };
        const style = config[status] || config.PENDING;
        return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style}`}>{status || 'PENDING'}</span>;
    };

    const inputClass = "w-full p-3 border rounded-lg bg-white dark:bg-[#2b2b2b] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Employee Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your activities and requests</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-8 overflow-x-auto border-b border-gray-200 dark:border-gray-700 pb-1">
                {[
                    { id: 'history', label: 'My Requests' },
                    { id: 'apply', label: 'Apply Leave' },
                    { id: 'feedback', label: 'Submit Feedback' },
                    { id: 'info', label: 'Info Request' }
                ].map((t) => (
                    <button 
                        key={t.id} 
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                            tab === t.id 
                            ? 'bg-white dark:bg-[#1e1e1e] text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#252525]'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content Container */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                
                {/* 1. History Tab */}
                {tab === 'history' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Request History</h2>
                        {history.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">No records found.</p>
                        ) : (
                            history.map(h => (
                                <div key={h.requestId} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525] border-gray-200 dark:border-gray-700 transition-colors duration-200">
                                    <div className="mb-2 md:mb-0 w-full">
                                        <div className="flex justify-between items-center w-full mb-2">
                                            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-sm">{h.attendenceType}</span>
                                            {getStatusBadge(h.status)}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
                                            <span className="font-mono">{h.startDate}</span>
                                            <span className="text-gray-400">➔</span>
                                            <span className="font-mono">{h.endDate}</span>
                                            <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                {getDays(h.startDate, h.endDate)} Days
                                            </span>
                                        </div>
                                        {h.managerComment && (
                                            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/30">
                                                <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">Manager's Note:</p>
                                                <p className="text-sm text-purple-900 dark:text-purple-200 italic">"{h.managerComment}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* 2. Apply Tab */}
                {tab === 'apply' && (
                    <form onSubmit={handleApply} className="max-w-2xl mx-auto space-y-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">New Request Application</h2>
                        
                        <div>
                            <label className={labelClass}>Request Type</label>
                            <select className={inputClass} value={att.attendenceType} onChange={e => setAtt({...att, attendenceType: e.target.value})}>
                                <option value="ATTENDENCE">Attendance Adjustment</option>
                                <option value="LEAVE">Leave Request</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Start Date</label>
                                <input type="date" className={inputClass} value={att.startDate} onChange={e => setAtt({...att, startDate: e.target.value})} required />
                            </div>
                            <div>
                                <label className={labelClass}>End Date</label>
                                <input type="date" className={inputClass} value={att.endDate} onChange={e => setAtt({...att, endDate: e.target.value})} required />
                            </div>
                        </div>

                        {appliedStatus === 'applied' && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800">
                                🛑 Conflict: You already have a request for these dates.
                            </div>
                        )}

                        <div>
                            <label className={labelClass}>Reason (Optional)</label>
                            <textarea className={inputClass} rows="3" placeholder="e.g. Sick leave, Family event..." value={att.userRequestComment} onChange={e => setAtt({...att, userRequestComment: e.target.value})} />
                        </div>

                        <button 
                            disabled={appliedStatus === 'applied'}
                            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] ${
                                appliedStatus === 'applied' 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                            }`}
                        >
                            Submit Application
                        </button>
                    </form>
                )}

                {/* 3. Feedback Tab */}
                {tab === 'feedback' && (
                    <form onSubmit={handleFeedback} className="max-w-2xl mx-auto space-y-6 py-4">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Anonymous Feedback</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your thoughts help us improve.</p>
                        </div>
                        <div>
                            <label className={labelClass}>Your Message</label>
                            <textarea className={inputClass} rows="6" placeholder="Share your suggestions, concerns, or ideas..." value={feed} onChange={e => setFeed(e.target.value)} required />
                        </div>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200">
                            Send Feedback
                        </button>
                    </form>
                )}

                {/* 4. Info Request Tab */}
                {tab === 'info' && (
                    <form onSubmit={handleInfo} className="max-w-2xl mx-auto space-y-6 py-4">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Request Information</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Need documents or clarifications? Ask here.</p>
                        </div>
                        <div>
                            <label className={labelClass}>Topic</label>
                            <input className={inputClass} placeholder="e.g. Salary Slip, Tax Form, Policy Document" value={info.requestType} onChange={e => setInfo({...info, requestType: e.target.value})} required />
                        </div>
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea className={inputClass} rows="4" placeholder="Describe exactly what you need..." value={info.requestDescription} onChange={e => setInfo({...info, requestDescription: e.target.value})} required />
                        </div>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200">
                            Submit Request
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default EmployeeDashboard;