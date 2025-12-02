import React, { useState } from "react";
import LoginBg from "../assets/LoginImage.png";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext"; // 1. Import Hook

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { notify } = useNotification(); // 2. Get notify function

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ username, password });
      const userData = res.data;

      localStorage.setItem("currentUser", JSON.stringify(userData));
      setUser(userData);

      // 3. Success Notification
      notify(`Welcome back, ${userData.user.username}!`, "success");

      if (userData.user.role === "ADMIN") navigate("/admin");
      else if (userData.user.role === "MANAGER") navigate("/manager");
      else navigate("/employee");
    } catch (error) {
      // 4. Failed Notification
      const msg =
        error.response?.data?.message || "Invalid Username or Password";
      notify(msg, "error");
    }
  };

  return (
     <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${LoginBg})` }}
        >
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Login
          </h3>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              className="w-full p-3 bg-gray-50 dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-gray-50 dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
