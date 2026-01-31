import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Profile() {
    const { user, setUser, setNotification } = useStateContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        password: "",
        password_confirmation: ""
    });

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        axiosClient.post('/profile', formData)
            .then(({ data }) => {
                setLoading(false);
                setUser(data.user);
                setNotification("Profil berhasil diperbarui!");
                setFormData(prev => ({...prev, password: "", password_confirmation: ""}));
            })
            .catch((err) => {
                setLoading(false);
                alert("Gagal memperbarui profil: " + (err.response?.data?.message || "Error"));
            });
    };

    return (
        <div className="max-w-2xl mx-auto py-8 animate-fade-in-up">
            <div className="text-center mb-10">
                <div className="w-24 h-24 bg-secondary-light text-secondary rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                <p className="text-gray-500">{user.email}</p>
                 <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                     user.role_id === 1 ? 'bg-red-100 text-red-700' : 
                     user.role_id === 2 ? 'bg-purple-100 text-purple-700' : 
                     'bg-green-100 text-green-700'
                 }`}>
                    {user.role_id === 1 ? 'Administrator' : user.role_id === 2 ? 'Konsultan' : 'Mahasiswa'}
                </span>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span>✏️</span> Edit Profil
                </h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Username</label>
                        <input 
                            type="text" 
                            className="input-field"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                        <input 
                            type="email" 
                            className="input-field"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-400 mb-4">*Kosongkan jika tidak ingin mengubah password</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Password Baru</label>
                                <input 
                                    type="password" 
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Konfirmasi Password Baru</label>
                                <input 
                                    type="password" 
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={formData.password_confirmation}
                                    onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button disabled={loading} className="btn-primary">
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
