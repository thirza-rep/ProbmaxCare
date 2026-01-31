import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";

export default function DailyCheckHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosClient.get('/daily-feedback')
            .then(({ data }) => {
                setLoading(false);
                setHistory(data);
            })
            .catch(() => setLoading(false));
    }, []);

    // Helper to get color based on score (similar to DailyFeedback view)
    const getScoreAttributes = (score) => {
        if (score <= 10) return { label: 'Normal', color: 'bg-green-100 text-green-700', border: 'border-green-500' };
        if (score <= 20) return { label: 'Stres Ringan', color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-500' };
        if (score <= 30) return { label: 'Stres Sedang', color: 'bg-orange-100 text-orange-700', border: 'border-orange-500' };
        return { label: 'Stres Berat', color: 'bg-red-100 text-red-700', border: 'border-red-500' };
    };

    return (
        <div className="max-w-4xl mx-auto py-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                     <h1 className="text-3xl font-bold text-gray-800">Riwayat Cek Harian 📜</h1>
                     <p className="text-gray-500">Pantau perkembangan kesehatan mentalmu dari waktu ke waktu.</p>
                </div>
                <Link to="/daily-check" className="btn-primary">
                    + Cek Baru
                </Link>
            </div>

            {loading ? (
                 <div className="text-center py-12">
                    <p className="text-gray-500">Memuat riwayat...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="card text-center py-16">
                    <div className="text-5xl mb-4 grayscale opacity-50">📉</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Belum ada riwayat</h3>
                    <p className="text-gray-500 mb-6">Kamu belum pernah melakukan cek kesehatan harian.</p>
                    <Link to="/daily-check" className="btn-secondary">
                        Mulai Cek Sekarang
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map(item => {
                        const attr = getScoreAttributes(item.total_score);
                        return (
                            <div key={item.id} className={`card border-l-8 ${attr.border} hover:shadow-md transition-shadow`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-gray-800">{item.total_score}</span>
                                            <span className="text-sm text-gray-500">poin</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${attr.color}`}>
                                        {attr.label}
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                    <span className="text-gray-500">
                                        🕒 {new Date(item.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    {/* Future expansion: Detail Link */}
                                    {/* <span className="text-primary cursor-pointer hover:underline">Lihat Detail</span> */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}
