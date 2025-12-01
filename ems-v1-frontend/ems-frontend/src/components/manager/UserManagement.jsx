import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, createUser, deleteUser } from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "EMPLOYEE",
    reportingId: "",
  });

  // Define load function with useCallback to ensure reference stability
  const load = useCallback(() => {
    getAllUsers()
        .then((res) => {
            if(res && res.data) {
                setUsers(res.data);
            }
        })
        .catch(err => console.error("Failed to load users", err));
  }, []);

  // Effect depends on load
  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
        await createUser(newUser);
        setNewUser({
            username: "",
            password: "",
            role: "EMPLOYEE",
            reportingId: "",
        });
        load();
    } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            await deleteUser(id);
            load();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          onSubmit={handleCreate}
        >
          <input
            className="border p-2 rounded w-full"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <select
            className="border p-2 rounded w-full bg-white"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Reports To (ID)"
            value={newUser.reportingId}
            onChange={(e) =>
              setNewUser({ ...newUser, reportingId: e.target.value })
            }
          />
          <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700 w-full font-medium">
            Create
          </button>
        </form>
      </div>

      {/* List Table */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reports To
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                    users.map((u) => (
                    <tr key={u.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.reportingId || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                            onClick={() => handleDelete(u.userId)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded border border-red-200"
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                            No users found.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
export default UserManagement;