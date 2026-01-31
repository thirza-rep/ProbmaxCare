import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ConsultantAppointments() {
  const { setNotification } = useStateContext();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = () => {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    
    axiosClient.get('/consultant/appointments', { params })
      .then(({ data }) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const updateStatus = (id, status) => {
    axiosClient.put(`/consultant/appointments/${id}`, { status })
      .then(() => {
        setNotification(`Appointment ${status === 'confirmed' ? 'disetujui' : status === 'completed' ? 'diselesaikan' : 'dibatalkan'}!`);
        fetchAppointments();
      })
      .catch(err => {
        console.error(err);
        alert('Gagal mengupdate status');
      });
  };

  const saveEdit = (id) => {
    axiosClient.put(`/consultant/appointments/${id}`, editForm)
      .then(() => {
        setNotification('Appointment berhasil diupdate!');
        setEditingId(null);
        setEditForm({});
        fetchAppointments();
      })
      .catch(err => {
        console.error(err);
        alert('Gagal menyimpan perubahan');
      });
  };

  const startEdit = (appointment) => {
    setEditingId(appointment.id);
    setEditForm({
      confirmed_date: appointment.confirmed_date || appointment.appointment_date,
      confirmed_time: appointment.confirmed_time || appointment.appointment_time,
      notes: appointment.notes || '',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    const labels = {
      pending: 'Menunggu',
      confirmed: 'Disetujui',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 spinner"></div>
          <p className="text-gray-500 font-medium">Memuat appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-2">Manajemen Janji Konseling</h1>
          <p className="text-gray-500 mt-1">Kelola janji konseling dari mahasiswa</p>
        </div>
        <Link to="/dashboard" className="btn-outline btn-sm">
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="card-compact">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { value: 'all', label: 'Semua', count: appointments.length },
            { value: 'pending', label: 'Menunggu', count: appointments.filter(a => a.status === 'pending').length },
            { value: 'confirmed', label: 'Disetujui', count: appointments.filter(a => a.status === 'confirmed').length },
            { value: 'completed', label: 'Selesai', count: appointments.filter(a => a.status === 'completed').length },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                filter === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Tidak ada appointment</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Belum ada mahasiswa yang mengajukan janji konseling.'
              : `Tidak ada appointment dengan status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map(appointment => (
            <div key={appointment.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-50 md:border-0 md:pb-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
                      {appointment.user?.username?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div className="truncate">
                      <h3 className="font-bold text-gray-800 text-lg truncate">{appointment.user?.username || 'Mahasiswa'}</h3>
                      <p className="text-xs text-gray-500 truncate">{appointment.user?.email}</p>
                    </div>
                  </div>

                  {editingId === appointment.id ? (
                    // Edit Mode
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="label">Tanggal Konfirmasi</label>
                          <input
                            type="date"
                            className="input-field"
                            value={editForm.confirmed_date || ''}
                            onChange={e => setEditForm({ ...editForm, confirmed_date: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="label">Jam Konfirmasi</label>
                          <input
                            type="time"
                            className="input-field"
                            value={editForm.confirmed_time || ''}
                            onChange={e => setEditForm({ ...editForm, confirmed_time: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label">Catatan Konsultan</label>
                        <textarea
                          className="input-field"
                          rows="2"
                          placeholder="Tambahkan catatan untuk mahasiswa..."
                          value={editForm.notes || ''}
                          onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(appointment.id)} className="btn-primary btn-sm">
                          Simpan
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn-ghost btn-sm">
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">📅 Tanggal Diajukan:</span>
                        <p className="font-medium text-gray-800">
                          {new Date(appointment.appointment_date).toLocaleDateString('id-ID', { 
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">⏰ Jam:</span>
                        <p className="font-medium text-gray-800">{appointment.appointment_time}</p>
                      </div>
                      {appointment.confirmed_date && (
                        <>
                          <div>
                            <span className="text-gray-500">✅ Tanggal Konfirmasi:</span>
                            <p className="font-medium text-green-700">
                              {new Date(appointment.confirmed_date).toLocaleDateString('id-ID', { 
                                day: 'numeric', month: 'long' 
                              })}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">⏰ Jam Konfirmasi:</span>
                            <p className="font-medium text-green-700">{appointment.confirmed_time}</p>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="text-gray-500">📍 Lokasi:</span>
                        <p className="font-medium text-gray-800">{appointment.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">📱 WhatsApp:</span>
                        <a 
                          href={`https://wa.me/${appointment.whatsapp_number.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-green-600 hover:underline"
                        >
                          {appointment.whatsapp_number}
                        </a>
                      </div>
                      {appointment.notes && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500">📝 Catatan:</span>
                          <p className="font-medium text-gray-800 bg-yellow-50 p-2 rounded mt-1">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Status & Actions */}
                <div className="flex flex-row md:flex-col gap-3 items-center md:items-end justify-between md:justify-start w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-gray-50">
                  <div className="md:mb-2">
                    {getStatusBadge(appointment.status)}
                  </div>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        onClick={() => updateStatus(appointment.id, 'confirmed')}
                        className="btn-primary btn-sm"
                      >
                        ✓ Setujui
                      </button>
                      <button
                        onClick={() => startEdit(appointment)}
                        className="btn-outline btn-sm"
                      >
                        ✏️ Edit Jadwal
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Yakin ingin membatalkan appointment ini?')) {
                            updateStatus(appointment.id, 'cancelled');
                          }
                        }}
                        className="btn-ghost btn-sm text-red-600 hover:bg-red-50"
                      >
                        ✕ Batalkan
                      </button>
                    </div>
                  )}

                  {appointment.status === 'confirmed' && (
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        onClick={() => updateStatus(appointment.id, 'completed')}
                        className="btn-primary btn-sm"
                      >
                        ✓ Tandai Selesai
                      </button>
                      <button
                        onClick={() => startEdit(appointment)}
                        className="btn-outline btn-sm"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}

                  {appointment.status === 'completed' && (
                    <p className="text-xs text-gray-500 mt-2">Sesi konseling selesai</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
