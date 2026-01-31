import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification, user } = useStateContext();

    // Form state
    const [formData, setFormData] = useState({
        appointment_date: "",
        appointment_time: "",
        whatsapp_number: "",
        location: "Online (Zoom/GMeet)" // Default
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        setLoading(true);
        axiosClient.get('/appointments')
            .then(({ data }) => {
                setLoading(false);
                setAppointments(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        axiosClient.post('/appointments', formData)
            .then(() => {
                setNotification("Janji temu berhasil dibuat!");
                fetchAppointments();
                setFormData({
                    appointment_date: "",
                    appointment_time: "",
                    whatsapp_number: "",
                    location: "Online (Zoom/GMeet)"
                });
            })
            .catch(err => {
                setLoading(false);
                const response = err.response;
                if (response && response.status === 422) {
                    alert(response.data.message);
                } else {
                    alert("Gagal membuat janji.");
                }
            });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Janji Konseling 🤝</h1>
                 {/* Only Consultants/Admin see link to manage schedules */}
                 {user.role_id !== 3 && (
                    <Link to="/schedules" className="btn-secondary btn-sm">
                        Atur Jadwal Saya
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-24">
                        <h2 className="text-xl font-bold text-primary-dark mb-4">Buat Janji Baru</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Tanggal</label>
                                <input 
                                    type="date" 
                                    className="input-field"
                                    value={formData.appointment_date}
                                    onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Waktu</label>
                                <input 
                                    type="time" 
                                    className="input-field"
                                    value={formData.appointment_time}
                                    onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Nomor WhatsApp</label>
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="081234567890"
                                    value={formData.whatsapp_number}
                                    onChange={e => setFormData({...formData, whatsapp_number: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Lokasi / Media</label>
                                <select 
                                    className="input-field"
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                >
                                    <option value="Online (Zoom/GMeet)">Online (Zoom/GMeet)</option>
                                    <option value="Offline (Kampus)">Offline (Kampus)</option>
                                </select>
                            </div>
                            
                            <button disabled={loading} className="btn-primary w-full mt-2">
                                {loading ? 'Memproses...' : 'Ajukan Janji Temu'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Riwayat Janji Temu</h2>
                    
                    {appointments.length === 0 ? (
                        <div className="card text-center py-12">
                            <div className="text-4xl mb-4 text-gray-300">📅</div>
                            <p className="text-gray-500 font-medium">Belum ada janji temu yang dibuat.</p>
                            <p className="text-xs text-gray-400 mt-1">Gunakan form di samping untuk mulai.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {appointments.map(appt => (
                                <div key={appt.id} className="card p-5 hover:border-primary/30 transition-all border border-transparent shadow-sm hover:shadow-md">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-sm border border-primary/5">
                                                {new Date(appt.appointment_date).getDate()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
                                                    {new Date(appt.appointment_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1 font-medium">
                                                    <span className="flex items-center gap-1.5"><span className="text-primary opacity-50 text-[10px]">●</span> {appt.appointment_time}</span>
                                                    <span className="flex items-center gap-1.5"><span className="text-secondary opacity-50 text-[10px]">●</span> {appt.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-50">
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block sm:hidden">Status</div>
                                            <span className="bg-green-100/80 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200 shadow-sm">
                                                Terjadwal
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between gap-3 italic">
                                        <div className="text-[10px] text-gray-400 font-medium">
                                            WhatsApp Terdaftar: <span className="text-gray-600 font-bold">{appt.whatsapp_number}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-medium">
                                            ID Janji: <span className="text-gray-300">#{appt.id}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
