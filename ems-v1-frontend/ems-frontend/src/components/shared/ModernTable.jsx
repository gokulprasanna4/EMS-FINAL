import React from 'react';

const ModernTable = ({ users, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl transition-colors duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 dark:bg-[#121212] text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Age</th>
                            <th className="px-6 py-4">Join Date</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {users.map((user) => (
                            <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors duration-200">
                                <td className="px-6 py-4 font-mono text-sm">{user.userId}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">{user.username}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-500">{user.role}</div>
                                </td>
                                <td className="px-6 py-4 text-sm">{user.mobileNumber || "-"}</td>
                                <td className="px-6 py-4 text-sm">{user.age || "-"}</td>
                                <td className="px-6 py-4 text-sm">{user.joiningDate || "-"}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${user.department === 'IT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                          user.department === 'HR' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' : 
                                          user.department === 'DEVELOPMENT' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                        {user.department || "N/A"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {user.employmentType === 'FULL_TIME' ? '✅ Full-time' : 
                                     user.employmentType === 'PART_TIME' ? '⏱ Part-time' :
                                     user.employmentType || "-"}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => onEdit(user)} className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-white transition">
                                        ✎
                                    </button>
                                    <button onClick={() => onDelete(user.userId)} className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/50 rounded text-red-600 dark:text-red-500 transition">
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && <div className="p-6 text-center text-gray-500 dark:text-gray-400">No records found.</div>}
        </div>
    );
};

export default ModernTable;