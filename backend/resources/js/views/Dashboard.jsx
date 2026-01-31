import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider"

export default function Dashboard() {
  const { user } = useStateContext();
  const [stats, setStats] = useState({}); // Admin stats
  const [userSummary, setUserSummary] = useState(null); // Student stats
  const [consultantSummary, setConsultantSummary] = useState(null); // Consultant stats
  const [users, setUsers] = useState([]); // Admin User Management List
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user.role_id === 1) { // Admin
        axiosClient.get('/admin/stats')
            .then(({data}) => { 
                setStats(data);
                return axiosClient.get('/admin/users');
            })
            .then(({data}) => setUsers(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    } else if (user.role_id === 2) { // Consultant
        axiosClient.get('/dashboard/consultant-summary')
            .then(({data}) => setConsultantSummary(data))
            .catch(err => console.error(err))
             .finally(() => setLoading(false));
    } else if (user.role_id === 3) { // Student
        axiosClient.get('/dashboard/user-summary')
            .then(({data}) => setUserSummary(data))
            .catch(err => console.error(err))
             .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-500 font-medium animate-pulse">Memuat Dashboard...</p>
          </div>
      </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Halo, <span className="text-primary">{user.username}</span> 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Selamat datang kembali! Apa kabarmu?</p>
        </div>
        <div>
             <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                 user.role_id === 1 ? 'bg-red-100 text-red-700' : 
                 user.role_id === 2 ? 'bg-purple-100 text-purple-700' : 
                 'bg-green-100 text-green-700'
             }`}>
                {user.role_id === 1 ? 'Administrator' : user.role_id === 2 ? 'Konsultan' : 'Mahasiswa'}
             </span>
        </div>
      </div>
      
      {/* ---------------- ADMIN DASHBOARD ---------------- */}
      {user.role_id === 1 && (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card border-l-4 border-primary flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total User</div>
                        <div className="text-3xl font-bold text-gray-800 mt-1">{stats.total_users || 0}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full text-primary">👥</div>
                </div>
                <div className="card border-l-4 border-secondary flex items-center justify-between">
                     <div>
                        <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Feedback</div>
                        <div className="text-3xl font-bold text-gray-800 mt-1">{stats.total_feedbacks || 0}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-full text-secondary">📝</div>
                </div>
            </div>

            <div className="card shadow-md border-none">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-primary-dark">Manajemen User</h2>
                        <p className="text-sm text-gray-400">Informasi data user yang terdaftar dan aktif</p>
                    </div>
                </div>
                <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                    <table className="w-full text-left min-w-[500px] sm:min-w-0">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 text-[10px] md:text-sm font-semibold">
                                <th className="py-6 px-4 first:pl-0">Pengguna</th>
                                <th className="py-6 px-4 hidden sm:table-cell">Email</th>
                                <th className="py-6 px-4 last:pr-0">Status Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-10 text-center text-gray-400 italic">Belum ada data user.</td>
                                </tr>
                            )}
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-6 px-4 first:pl-0">
                                        <div className="font-bold text-gray-800">{u.username}</div>
                                        <div className="text-[10px] text-gray-400 sm:hidden">{u.email}</div>
                                    </td>
                                    <td className="py-6 px-4 text-gray-500 hidden sm:table-cell">{u.email}</td>
                                    <td className="py-6 px-4 last:pr-0">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            u.role_id === 1 ? 'bg-red-100 text-red-700' :
                                            u.role_id === 2 ? 'bg-purple-100 text-purple-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {u.role ? u.role.name : (u.role_id === 1 ? 'Admin' : u.role_id === 2 ? 'Consultant' : 'Mahasiswa')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}

      {/* ---------------- CONSULTANT DASHBOARD ---------------- */}
      {user.role_id === 2 && consultantSummary && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-l-4 border-primary bg-white shadow-sm">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Appointment Minggu Ini</div>
                    <div className="text-4xl font-black text-gray-800">{consultantSummary?.stats?.appointments_this_week || 0}</div>
                </div>
                <div className="card border-l-4 border-secondary bg-white shadow-sm">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Appointment Terdekat</div>
                    {consultantSummary?.stats?.nearest_appointment ? (
                        <div>
                            <div className="text-lg font-black text-gray-800 truncate">{consultantSummary?.stats?.nearest_appointment?.user?.username}</div>
                            <div className="text-sm font-bold text-secondary mt-1">
                                📅 {new Date(consultantSummary?.stats?.nearest_appointment?.appointment_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} | ⏰ {consultantSummary?.stats?.nearest_appointment?.appointment_time}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 italic text-sm mt-2">Tidak ada janji mendatang</div>
                    )}
                </div>
                <div className="card border-l-4 border-accent-green bg-white shadow-sm">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Jadwal Aktif</div>
                    <div className="text-4xl font-black text-gray-800">{consultantSummary?.stats?.active_schedules_count || 0}</div>
                </div>
            </div>

            <div className="card shadow-md border-none pb-0">
                <div className="flex justify-between items-center mb-6 px-6 pt-2">
                    <h2 className="text-xl font-black text-gray-800">Janji Konseling Terbaru</h2>
                    <Link to="/consultant/appointments" className="text-primary text-sm font-bold hover:underline">Lihat Semua</Link>
                </div>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest ">
                                <th className="px-6 py-4">Mahasiswa</th>
                                <th className="px-6 py-4">Waktu</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                            {consultantSummary?.recent_appointments?.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 font-bold text-gray-800">{app.user.username}</td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-700">{new Date(app.appointment_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</div>
                                        <div className="text-[10px] text-gray-400">{app.appointment_time}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            app.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                            app.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link to="/consultant/appointments" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-block border border-transparent hover:border-primary/20">
                                            📝
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
      )}

      {/* ---------------- STUDENT DASHBOARD ---------------- */}
      {user.role_id === 3 && userSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card relative overflow-hidden group hover:border-accent-green transition-colors">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-accent-green rounded-full"></span>
                    Cek Harian Terakhir
                </h3>
                {userSummary.last_daily_check ? (
                    <div className="mt-2">
                        <div className="text-4xl font-bold text-gray-800">{userSummary.last_daily_check.total_score}</div>
                        <div className={`text-sm font-semibold inline-block px-2 py-1 rounded mt-2 mb-1 ${
                             userSummary.last_daily_check.stress_level.includes('Normal') ? 'bg-green-100 text-green-700' : 
                             userSummary.last_daily_check.stress_level.includes('Ringan') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {userSummary.last_daily_check.stress_level}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm italic py-4">Belum ada data cek harian.</p>
                )}
                 <Link to="/daily-check" className="mt-6 block text-center w-full py-2 rounded-lg bg-green-50 text-accent-green font-semibold hover:bg-accent-green hover:text-white transition-colors">
                    {userSummary.last_daily_check ? 'Cek Lagi' : 'Cek Sekarang'}
                 </Link>
            </div>

            <div className="card relative overflow-hidden group hover:border-secondary transition-colors">
                 <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-secondary rounded-full"></span>
                    Mood Terakhir
                </h3>
                 {userSummary.last_mood ? (
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-gray-800">{userSummary.last_mood.selected_mood}</div>
                        <div className="text-sm font-medium text-gray-600 mt-2">{userSummary.last_mood.selected_habit}</div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm italic py-4">Belum ada mood tercatat.</p>
                )}
                <Link to="/pmc-game" className="mt-6 block text-center w-full py-2 rounded-lg bg-purple-50 text-secondary font-semibold hover:bg-secondary hover:text-white transition-all">
                    Main PMC Game
                </Link>
            </div>

            <div className="card relative overflow-hidden group hover:border-primary transition-colors">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Janji Berikutnya
                </h3>
                 {userSummary.next_appointment ? (
                    <div className="mt-2">
                        <div className="text-2xl font-bold text-gray-800">
                             {new Date(userSummary.next_appointment.appointment_date).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long'})}
                        </div>
                        <div className="text-lg font-semibold text-primary mt-1">⏰ {userSummary.next_appointment.appointment_time}</div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm italic py-4">Tidak ada janji mendatang.</p>
                )}
                 <Link to="/appointments" className="mt-6 block text-center w-full py-2 rounded-lg bg-blue-50 text-primary font-semibold hover:bg-primary hover:text-white transition-all">
                    {userSummary.next_appointment ? 'Lihat Detail' : 'Buat Janji'}
                 </Link>
            </div>
        </div>
      )}
    </div>
  )
}
