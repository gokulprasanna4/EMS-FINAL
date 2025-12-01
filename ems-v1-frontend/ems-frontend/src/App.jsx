import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './components/Login';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import ProfilePage from './components/shared/ProfilePage';

// --- Icons ---
const PersonIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const LockIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3 3.1-3s3.1 1.29 3.1 3v2z"/></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>;

// --- Theme Toggle ---
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
            title="Toggle Theme"
        >
            {theme === 'light' ? '🌙' : '☀'}
        </button>
    );
};

// --- Profile Dropdown ---
const ProfileDropdown = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigation = (path, tab) => {
        setIsOpen(false);
        navigate(path, { state: { tab } }); 
    };

    const handleLogout = () => {
        setIsOpen(false);
        onLogout();
    };

    const initials = user.username ? user.username.charAt(0).toUpperCase() : 'U';

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center gap-2 focus:outline-none group"
            >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md hover:bg-blue-700 transition-all">
                    {initials}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#252525]">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">{user.role}</p>
                    </div>

                    <div className="py-2">
                        <button onClick={() => handleNavigation('/profile', 'profile')} className="w-full text-left px-5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                            <PersonIcon /> Update Profile
                        </button>
                        <button onClick={() => handleNavigation('/profile', 'security')} className="w-full text-left px-5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors">
                            <LockIcon /> Reset Password
                        </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-2">
                        <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors font-medium">
                            <LogoutIcon /> Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

function AppContent() {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem("currentUser");
        return saved ? JSON.parse(saved) : null;
    });

    const logout = () => { 
        localStorage.removeItem("currentUser"); 
        setCurrentUser(null); 
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100">
                <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50 transition-colors">
                    
                    <div className="flex items-center gap-6">
                        <Link to="/" className="font-extrabold text-2xl text-blue-600 dark:text-blue-400 tracking-tight cursor-pointer">
                            Employee Corner
                        </Link>
                        
                        {/* HOME BUTTON */}
                        {currentUser && (
                            <Link to="/" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors">
                                Home
                            </Link>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {currentUser && <ProfileDropdown user={currentUser.user} onLogout={logout} />}
                    </div>
                </nav>

                <main className="py-8">
                    <Routes>
                        <Route path="/login" element={!currentUser ? <Login setUser={setCurrentUser} /> : <Navigate to="/" />} />
                        <Route path="/admin" element={currentUser?.user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
                        <Route path="/manager" element={currentUser?.user.role === 'MANAGER' ? <ManagerDashboard /> : <Navigate to="/login" />} />
                        <Route path="/employee" element={currentUser ? <EmployeeDashboard currentUser={currentUser} /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={currentUser ? <ProfilePage currentUser={currentUser} onLogout={logout} /> : <Navigate to="/login" />} />
                        
                        <Route path="/" element={
                            !currentUser ? <Navigate to="/login" /> : 
                            currentUser.user.role === 'ADMIN' ? <Navigate to="/admin" /> : 
                            currentUser.user.role === 'MANAGER' ? <Navigate to="/manager" /> : 
                            <Navigate to="/employee" />
                        } />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}