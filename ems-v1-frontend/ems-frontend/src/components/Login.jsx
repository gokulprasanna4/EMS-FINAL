import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser({ username, password });
            const userData = res.data;
            localStorage.setItem("currentUser", JSON.stringify(userData));
            setUser(userData);
            if (userData.user.role === 'ADMIN') navigate("/admin");
            else if (userData.user.role === 'MANAGER') navigate("/manager");
            else navigate("/employee");
        } catch (error) { 
            alert("Invalid Credentials"); 
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#121212]">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Login</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input className="w-full border dark:border-gray-600 p-2 rounded mt-1 bg-white dark:bg-[#2b2b2b] text-gray-900 dark:text-white focus:ring-blue-500" value={username} onChange={e => setUsername(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" className="w-full border dark:border-gray-600 p-2 rounded mt-1 bg-white dark:bg-[#2b2b2b] text-gray-900 dark:text-white focus:ring-blue-500 mb-4" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded font-medium transition">Sign In</button>
                </form>
            </div>
        </div>
    );
};
export default Login;