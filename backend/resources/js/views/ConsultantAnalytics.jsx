import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";

export default function ConsultantAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/consultant/analytics')
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 spinner"></div>
          <p className="text-gray-500 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Gagal memuat data. Silakan refresh halaman.</p>
      </div>
    );
  }

  const categoryColors = {
    'Normal': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
    'Stres Ringan': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' },
    'Stres Sedang': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
    'Stres Berat': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
  };

  const moodEmojis = {
    'Senang': '😊',
    'Sedih': '😢',
    'Marah': '😠',
    'Cemas': '😰',
    'Tenang': '😌',
    'Bingung': '😕',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-2">Ringkasan Kondisi Mahasiswa</h1>
          <p className="text-gray-500 mt-1">Data agregat untuk mendukung layanan konseling</p>
        </div>
        <Link to="/dashboard" className="btn-outline btn-sm">
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Privacy Notice */}
      <div className="alert-info">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-medium">Data Agregat & Privasi</p>
          <p className="text-sm">Data ini hanya menampilkan pola umum, tidak menampilkan detail jawaban per individu.</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-primary-light to-white border-none shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-primary-dark mb-1">Total Mahasiswa</h3>
              <p className="text-gray-600 text-sm mb-4">Terdaftar di sistem</p>
            </div>
            <div className="p-3 bg-white rounded-xl text-2xl shadow-sm">👥</div>
          </div>
          <p className="text-5xl font-black text-primary-dark">{data.total_students}</p>
        </div>

        <div className="card bg-gradient-to-br from-secondary-light to-white border-none shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-secondary-dark mb-1">Mahasiswa Aktif</h3>
              <p className="text-gray-600 text-sm mb-4">Pernah menggunakan fitur</p>
            </div>
            <div className="p-3 bg-white rounded-xl text-2xl shadow-sm">✨</div>
          </div>
          <p className="text-5xl font-black text-secondary-dark">{data.active_students}</p>
          <p className="text-sm text-gray-600 mt-2">
            {data.total_students > 0 
              ? `${Math.round((data.active_students / data.total_students) * 100)}% dari total`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Distribusi Kategori Kondisi Mental</h2>
        <p className="text-sm text-gray-500 mb-6">Berdasarkan hasil Cek Kesehatan Harian</p>

        {data.category_distribution && data.category_distribution.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.category_distribution.map((cat, index) => {
              const colors = categoryColors[cat.category] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-500' };
              return (
                <div key={index} className={`card-compact ${colors.bg} border-l-4 ${colors.border}`}>
                  <h3 className={`font-bold ${colors.text} mb-2`}>{cat.category}</h3>
                  <p className={`text-3xl font-black ${colors.text}`}>{cat.count}</p>
                  <p className="text-xs text-gray-600 mt-1">mahasiswa</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Belum ada data cek harian dari mahasiswa</p>
          </div>
        )}
      </div>

      {/* Mood Trends */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tren Mood Harian (7 Hari Terakhir)</h2>
        <p className="text-sm text-gray-500 mb-6">Agregat mood dari PMC Game</p>

        {data.mood_trends && data.mood_trends.length > 0 ? (
          <div className="space-y-3">
            {/* Group by date */}
            {Object.entries(
              data.mood_trends.reduce((acc, item) => {
                if (!acc[item.date]) acc[item.date] = [];
                acc[item.date].push(item);
                return acc;
              }, {})
            ).map(([date, moods]) => (
              <div key={date} className="border-l-4 border-secondary pl-4 py-2">
                <p className="font-semibold text-gray-700 mb-2">
                  {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood, idx) => (
                    <div key={idx} className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                      <span className="text-xl">{moodEmojis[mood.selected_mood] || '😐'}</span>
                      <span className="text-sm font-medium text-gray-700">{mood.selected_mood}</span>
                      <span className="text-xs text-gray-500">({mood.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Belum ada data mood dari mahasiswa</p>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="card bg-gradient-to-br from-accent-green/10 to-white border-l-4 border-accent-green">
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Insight untuk Konsultan
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-accent-green">•</span>
            <span>Data ini membantu memahami pola umum kondisi mental mahasiswa tanpa melanggar privasi individu.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-green">•</span>
            <span>Jika banyak mahasiswa dalam kategori "Stres Sedang" atau "Stres Berat", pertimbangkan untuk mengadakan sesi konseling kelompok atau webinar.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-green">•</span>
            <span>Tren mood dapat membantu mengidentifikasi periode-periode tertentu yang mungkin lebih menantang bagi mahasiswa (misalnya: minggu ujian).</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
