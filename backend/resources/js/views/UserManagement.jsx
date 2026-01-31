import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { setNotification } = useStateContext();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role_id: 3 // Default to User
    });

    useEffect(() => {
        getUsers();
        getRoles();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/admin/users')
            .then(({ data }) => {
                setLoading(false);
                setUsers(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const getRoles = () => {
        axiosClient.get('/admin/roles')
            .then(({ data }) => {
                setRoles(data);
            });
    };

    const onDelete = (user) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            return;
        }
        axiosClient.delete(`/admin/users/${user.id}`)
            .then(() => {
                setNotification("User berhasil dihapus");
                getUsers();
            });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        const request = editingUser
            ? axiosClient.put(`/admin/users/${editingUser.id}`, formData)
            : axiosClient.post('/admin/users', formData);

        request
            .then(() => {
                setNotification(editingUser ? "User berhasil diperbarui" : "User berhasil ditambahkan");
                setShowForm(false);
                setEditingUser(null);
                setFormData({ username: '', email: '', password: '', role_id: 3 });
                getUsers();
            })
            .catch(err => {
                setLoading(false);
                const response = err.response;
                if (response && response.status === 422) {
                    setNotification(Object.values(response.data.errors).flat().join(", "), "error");
                }
            });
    };

    const onEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '', // Don't show password
            role_id: user.role_id
        });
        setShowForm(true);
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-gray-800">Manajemen User</h1>
                <button 
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({ username: '', email: '', password: '', role_id: 3 });
                        setShowForm(true);
                    }} 
                    className="btn-primary"
                >
                    + Tambah User
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-800 mb-6">
                                {editingUser ? 'Edit User' : 'Tambah User Baru'}
                            </h2>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div>
                                    <label className="label">Username</label>
                                    <input 
                                        value={formData.username}
                                        onChange={ev => setFormData({...formData, username: ev.target.value})}
                                        className="input-field" 
                                        placeholder="Username" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input 
                                        value={formData.email}
                                        onChange={ev => setFormData({...formData, email: ev.target.value})}
                                        type="email" 
                                        className="input-field" 
                                        placeholder="Email" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="label">Password {editingUser && '(Kosongkan jika tidak ingin ganti)'}</label>
                                    <input 
                                        value={formData.password}
                                        onChange={ev => setFormData({...formData, password: ev.target.value})}
                                        type="password" 
                                        className="input-field" 
                                        placeholder="Password" 
                                        required={!editingUser} 
                                    />
                                </div>
                                <div>
                                    <label className="label">Role</label>
                                    <select 
                                        value={formData.role_id}
                                        onChange={ev => setFormData({...formData, role_id: parseInt(ev.target.value)})}
                                        className="input-field"
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                                        {loading ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="card overflow-x-auto p-0 border-none shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-black text-gray-600 uppercase tracking-wider hidden sm:table-cell">ID</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-black text-gray-600 uppercase tracking-wider">Username</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-black text-gray-600 uppercase tracking-wider hidden md:table-cell">Email</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-black text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-4 md:px-6 py-4 text-[10px] md:text-sm font-black text-gray-600 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        Memuat data...
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 md:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">#{user.id}</td>
                                <td className="px-4 md:px-6 py-4">
                                    <div className="text-sm font-bold text-gray-800">{user.username}</div>
                                    <div className="text-[10px] text-gray-400 md:hidden">{user.email}</div>
                                </td>
                                <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{user.email}</td>
                                <td className="px-4 md:px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        user.role_id === 1 ? 'bg-purple-100 text-purple-700' :
                                        user.role_id === 2 ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {user.role?.name || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-4 text-right space-x-1 md:space-x-2">
                                    <button onClick={() => onEdit(user)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex border border-transparent hover:border-primary/20">
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => onDelete(user)} className="p-2 text-accent-red hover:bg-red-50 rounded-lg transition-colors inline-flex border border-transparent hover:border-red-200">
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
