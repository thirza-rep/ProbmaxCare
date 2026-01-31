import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const moodOptions = [
    { label: "Sangat Senang", icon: "🤩", description: "Luar biasa!", color: "from-yellow-400 to-orange-400", bg: "bg-yellow-50" },
    { label: "Senang", icon: "🙂", description: "Hari yang baik", color: "from-green-400 to-emerald-400", bg: "bg-green-50" },
    { label: "Biasa", icon: "😐", description: "Cukup baik", color: "from-gray-400 to-slate-400", bg: "bg-gray-50" },
    { label: "Sedih", icon: "😢", description: "Perlu pelukan", color: "from-blue-400 to-indigo-400", bg: "bg-blue-50" },
    { label: "Marah", icon: "😡", description: "Sabar ya", color: "from-red-400 to-rose-400", bg: "bg-red-50" },
    { label: "Cemas", icon: "😰", description: "Tarik nafas...", color: "from-purple-400 to-violet-400", bg: "bg-purple-50" }
];

const habits = ["Olahraga", "Tidur Cukup", "Makan Sehat", "Meditasi", "Jalan-jalan", "Membaca", "Gaming", "Belajar", "Sosialisasi"];
const likings = ["Musik", "Film", "Alam", "Seni", "Teknologi", "Kuliner", "Olahraga", "Travel"];

const onlineGames = [
    {
        title: "Casual Chess",
        description: "Bermain catur dengan Komputer untuk mengasah otak Anda.",
        image: "♟️",
        url: "https://www.jopi.com/gam/casual-chess/",
        color: "bg-slate-800"
    },
    {
        title: "Find 500 Differences",
        description: "Mencari perbedaan gambar, game untuk menguji seberapa konsentrasi dan teliti Anda.",
        image: "🔍",
        url: "https://www.jopi.com/gam/find-500-differences/",
        isAvailable: true,
        color: "bg-blue-500"
    },
    {
        title: "Brain Tricky",
        description: "Pecahkan teka-teki ini untuk mengasah otak dan ketangkasan Anda dalam memecahkan masalah.",
        image: "🧠",
        url: "https://www.jopi.com/gam/brain-tricky-puzzles/",
        color: "bg-red-500"
    }
];

export default function UserFeedback() {
    const { setNotification } = useStateContext();
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedHabit, setSelectedHabit] = useState("");
    const [selectedLiking, setSelectedLiking] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (!selectedMood || !selectedHabit || !selectedLiking) {
            setNotification("Lengkapi semua pilihan ya! 😊", "error");
            return;
        }

        setLoading(true);
        const payload = {
            selected_mood: selectedMood.label,
            selected_habit: selectedHabit,
            selected_liking: selectedLiking
        };

        axiosClient.post('/user-feedback', payload)
            .then(() => {
                setLoading(false);
                setSubmitted(true);
                setNotification("Mood tracker berhasil disimpan! ✨");
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
                setNotification("Gagal menyimpan data.", "error");
            });
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto text-center py-12 animate-fade-in-up">
                <div className="card shadow-2xl border-t-8 border-secondary p-8 mb-6">
                    <div className="text-7xl mb-6 animate-bounce">🎊</div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">Terima Kasih!</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Kamu sudah mencatat mood hari ini. <br/>
                        Teruslah peduli dengan kesehatan mentalmu! 💚
                    </p>
                    <Link to="/dashboard" className="btn-primary btn-lg w-full">
                        Ke Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in-up">
            <header className="text-center space-y-3">
                <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-sm">
                    Fitur Keren Kami
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-800">
                    PMC <span className="text-secondary">Game / Tracker</span> 🎮
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Pilih opsi menarik, cari tahu mood kamu hari ini, dan temukan aktivitas seru buat ngisi waktu!
                </p>
            </header>

            <form onSubmit={onSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-10 space-y-12">
                    {/* Mood Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center font-black">1</div>
                            <h2 className="text-2xl font-black text-gray-800">Bagaimana mood kamu hari ini?</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 font-inter">
                            {moodOptions.map(m => (
                                <button
                                    key={m.label}
                                    type="button"
                                    onClick={() => setSelectedMood(m)}
                                    className={`relative group flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                                        selectedMood?.label === m.label 
                                        ? `border-transparent bg-gradient-to-br ${m.color} text-white shadow-lg scale-105` 
                                        : `border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white`
                                    }`}
                                >
                                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{m.icon}</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
                                    {selectedMood?.label === m.label && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${m.color}`}></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="border-t border-gray-100"></div>

                    {/* Habits Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">2</div>
                            <h2 className="text-2xl font-black text-gray-800">Kegiatan positif apa yang kamu lakukan?</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {habits.map(h => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => setSelectedHabit(h)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        selectedHabit === h
                                        ? "bg-primary text-white shadow-lg ring-4 ring-primary/20 scale-105"
                                        : "bg-white border-2 border-gray-100 text-gray-600 hover:border-primary/50 hover:bg-primary/5 shadow-sm"
                                    }`}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="border-t border-gray-100"></div>

                    {/* Likings Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-green text-white flex items-center justify-center font-black">3</div>
                            <h2 className="text-2xl font-black text-gray-800">Apa yang sedang kamu minati saat ini?</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {likings.map(l => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setSelectedLiking(l)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                        selectedLiking === l
                                        ? "bg-accent-green text-white shadow-lg ring-4 ring-accent-green/20 scale-105"
                                        : "bg-white border-2 border-gray-100 text-gray-600 hover:border-accent-green/50 hover:bg-accent-green/5 shadow-sm"
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="pt-6">
                        <button 
                            disabled={loading}
                            className="btn-secondary w-full py-5 text-xl font-black shadow-2xl shadow-secondary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>Simpan Mood Hari Ini 🚀</>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Online Games Section */}
            <section className="space-y-8 py-12">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black text-gray-800">Online Games</h2>
                    <p className="text-gray-500">Bermain game untuk bersenang-senang di sini!</p>
                    <p className="text-xs text-gray-400 font-medium">Sumber Game : Jopi.com</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {onlineGames.map((game, index) => (
                        <div key={index} className="flex flex-col h-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            {/* Game Header/Banner */}
                            <div className={`h-48 ${game.color} flex flex-col items-center justify-center text-white relative overflow-hidden p-6 text-center`}>
                                {/* Reference text from image */}
                                {game.title === "Casual Chess" && (
                                    <div className="z-10 text-[10px] font-bold uppercase mb-2 opacity-80 leading-tight">
                                        CASUAL CHESS IS NOT<br/>AVAILABLE HERE.
                                    </div>
                                )}
                                {game.title === "Brain Tricky" && (
                                    <div className="z-10 text-[10px] font-bold uppercase mb-2 opacity-80 leading-tight">
                                        BRAIN TRICKY PUZZLES IS NOT<br/>AVAILABLE HERE.
                                    </div>
                                )}
                                
                                <div className="text-6xl mb-2 group-hover:scale-125 transition-transform duration-500 z-10">{game.image}</div>
                                
                                {game.title === "Find 500 Differences" && (
                                     <div className="absolute inset-0 bg-blue-400/20 backdrop-blur-[2px] z-0"></div>
                                )}

                                <p className="text-[9px] font-bold z-10 px-4 mt-2">
                                    IF YOU WANT TO PLAY {game.title.toUpperCase()}, <br/>
                                    <span className="underline cursor-pointer">CLICK HERE TO PLAY</span>
                                </p>

                                {game.title === "Find 500 Differences" && (
                                    <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                         </svg>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-1 text-center items-center">
                                <h3 className="text-xl font-black text-gray-800 mb-3">{game.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                                    {game.description}
                                </p>
                                <a 
                                    href={game.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gray-100 text-gray-800 font-black text-sm hover:bg-gray-800 hover:text-white transition-all shadow-md active:scale-95"
                                >
                                    PLAY 
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
