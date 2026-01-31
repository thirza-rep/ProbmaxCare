import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ConsultantSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    const [formData, setFormData] = useState({
        date: "",
        start_time: "",
        end_time: "",
        description: ""
    });

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = () => {
        setLoading(true);
        axiosClient.get('/schedules')
            .then(({ data }) => {
                setLoading(false);
                setSchedules(data);
            })
            .catch(() => setLoading(false));
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        axiosClient.post('/schedules', formData)
            .then(() => {
                setNotification("Jadwal berhasil ditambahkan");
                fetchSchedules();
                setFormData({ date: "", start_time: "", end_time: "", description: "" });
            })
            .catch(err => alert("Gagal menyimpan jadwal"));
    };

    const onDelete = (id) => {
        if (!window.confirm("Hapus jadwal ini?")) return;
        axiosClient.delete(`/schedules/${id}`)
            .then(() => {
                setNotification("Jadwal dihapus");
                fetchSchedules();
            });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800">Kelola Jadwal Konsultasi 🗓️</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-24">
                        <h2 className="text-xl font-bold text-secondary-dark mb-4">Tambah Jadwal</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Tanggal</label>
                                <input 
                                    type="date" 
                                    className="input-field"
                                    value={formData.date}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Mulai</label>
                                    <input 
                                        type="time" 
                                        className="input-field"
                                        value={formData.start_time}
                                        onChange={e => setFormData({...formData, start_time: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Selesai</label>
                                    <input 
                                        type="time" 
                                        className="input-field"
                                        value={formData.end_time}
                                        onChange={e => setFormData({...formData, end_time: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Keterangan (Opsional)</label>
                                <textarea 
                                    className="input-field"
                                    placeholder="Contoh: Sesi Pagi"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>
                            
                            <button className="btn-primary w-full bg-secondary hover:bg-secondary-dark">
                                Simpan Jadwal
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Daftar Jadwal Saya</h2>
                    
                    {schedules.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-gray-500">Belum ada jadwal yang diatur.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {schedules.map(sch => (
                                <div key={sch.id} className="card flex items-center justify-between p-4 group hover:border-secondary/30 transition-colors border border-transparent">
                                     <div className="flex gap-4 items-center">
                                        <div className="bg-purple-100 text-secondary w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0">
                                            <span className="text-xs font-bold uppercase">{new Date(sch.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-xl font-bold">{new Date(sch.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 text-lg">
                                                {sch.start_time.slice(0,5)} - {sch.end_time.slice(0,5)}
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                {sch.description || "Tersedia untuk konsultasi"}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onDelete(sch.id)}
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        title="Hapus Jadwal"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
