import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Icons for Success & Error ---
const SuccessIcon = () => (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const ErrorIcon = () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    // Auto-hide after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Function to trigger notification
    const notify = (message, type = 'success') => {
        setNotification({ message, type });
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            
            {/* --- The Notification Toast --- */}
            {notification && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border-l-8 transform transition-all duration-300 animate-slide-in ${
                    notification.type === 'error' 
                    ? 'bg-white dark:bg-[#1e1e1e] border-red-500 text-gray-800 dark:text-white' 
                    : 'bg-white dark:bg-[#1e1e1e] border-green-500 text-gray-800 dark:text-white'
                }`}>
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                        {notification.type === 'error' ? <ErrorIcon /> : <SuccessIcon />}
                    </div>

                    {/* Text Section */}
                    <div>
                        <h4 className={`font-bold text-xs uppercase tracking-widest mb-0.5 ${
                            notification.type === 'error' ? 'text-red-500' : 'text-green-500'
                        }`}>
                            {notification.type === 'error' ? 'Failed' : 'Success'}
                        </h4>
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={() => setNotification(null)} 
                        className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                    >
                        ✕
                    </button>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);