import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const questionnaire = [
  {
    question: "Bagaimana perasaan Anda dalam 7 hari terakhir?",
    options: [
      { label: "Merasa bahagia dan seimbang", score: 0 },
      { label: "Baik-baik saja, namun kadang merasa bosan", score: 1 },
      { label: "Lelah, kurang semangat, atau mudah tersinggung", score: 2 },
      { label: "Sering cemas atau khawatir berlebihan", score: 3 }
    ]
  },
  {
    question: "Apakah Anda memiliki seseorang untuk diajak berbicara saat sedang stres atau sedih?",
    options: [
      { label: "Ya, saya punya teman/keluarga yang bisa dipercaya", score: 0 },
      { label: "Hanya kadang-kadang, tidak selalu", score: 1 },
      { label: "Tidak, saya cenderung memendam semuanya sendiri", score: 2 },
      { label: "Saya lebih suka menulis atau mengalihkan perhatian ke hobi", score: 3 }
    ]
  },
  {
    question: "Berapa jam tidur Anda rata-rata setiap malam?",
    options: [
      { label: "Kurang dari 5 jam", score: 3 },
      { label: "5 - 6 jam", score: 2 },
      { label: "7 - 8 jam", score: 1 },
      { label: "Lebih dari 8 jam", score: 0 }
    ]
  },
  {
    question: "Apa yang biasanya Anda lakukan untuk mengatasi stres?",
    options: [
      { label: "Olahraga atau melakukan aktivitas fisik", score: 0 },
      { label: "Bermeditasi, membaca, atau melakukan hobi", score: 1 },
      { label: "Menonton film, bermain game, atau makan camilan", score: 2 },
      { label: "Tidak melakukan apa pun, hanya membiarkan stres menumpuk", score: 3 }
    ]
  },
  {
    question: "Seberapa sering Anda merasa kewalahan dengan rutinitas sehari-hari?",
    options: [
      { label: "Jarang atau tidak pernah", score: 0 },
      { label: "Kadang-kadang", score: 1 },
      { label: "Beberapa kali dalam seminggu", score: 2 },
      { label: "Hampir setiap hari", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa tertekan dengan tugas-tugas perkuliahan?",
    options: [
      { label: "Tidak pernah, saya menikmatinya", score: 0 },
      { label: "Sesekali saja", score: 1 },
      { label: "Sering merasa lelah", score: 2 },
      { label: "Sangat tertekan dan ingin berhenti", score: 3 }
    ]
  }
];

// Helper to determine score color/category
const getResultCategory = (score) => {
    // adjusted threshold for 6 questions (max score 18)
    if (score <= 4) return { category: 'Normal', color: 'bg-green-100 text-green-800', border: 'border-green-500', icon: '😊' };
    if (score <= 8) return { category: 'Stres Ringan', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500', icon: '😐' };
    if (score <= 13) return { category: 'Stres Sedang', color: 'bg-orange-100 text-orange-800', border: 'border-orange-500', icon: '😟' };
    return { category: 'Stres Berat', color: 'bg-red-100 text-red-800', border: 'border-red-500', icon: '😰' };
};

export default function DailyFeedback() {
    const { setNotification } = useStateContext();
    const [answers, setAnswers] = useState(Array(questionnaire.length).fill(null));
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleOptionChange = (qIndex, score) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = score;
        setAnswers(newAnswers);
    };

    const submitFeedback = (ev) => {
        ev.preventDefault();
        
        if (answers.includes(null)) {
            alert("Harap jawab semua pertanyaan.");
            return;
        }

        const total_score = answers.reduce((a, b) => a + (b || 0), 0);
        const cat = getResultCategory(total_score);

        setLoading(true);
        axiosClient.post('/daily-feedback', {
            total_score,
            stress_level: cat.category,
            color: cat.color,
            answers_json: answers
        })
            .then(({data}) => {
                setLoading(false);
                setResult(data);
                setSubmitted(true);
                setNotification("Cek harian berhasil disimpan!");
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
                alert("Gagal menyimpan data.");
            });
    };

    if (submitted && result) {
        const cat = getResultCategory(result.total_score);
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
                <div className={`card text-center p-10 border-t-8 ${cat.border} relative overflow-hidden`}>
                     <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-gradient-to-b from-current to-transparent pointer-events-none"></div>
                     
                     <div className="text-6xl mb-4">{cat.icon}</div>
                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Hasil Cek Harian Kamu</h2>
                     
                     <div className="my-6">
                        <span className={`text-5xl font-extrabold ${cat.color.split(' ')[1]}`}>{result.total_score}</span>
                        <p className="text-gray-400 text-sm mt-1">Skor Total</p>
                     </div>

                     <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold mb-6 ${cat.color}`}>
                         {cat.category}
                     </div>

                     <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                         {cat.category === 'Normal' ? "Kondisi mentalmu tampak stabil. Pertahankan gaya hidup sehatmu!" :
                          cat.category === 'Stres Ringan' ? "Kamu mungkin sedang banyak pikiran. Istirahat sejenak dan lakukan hobi ya." :
                          "Sepertinya kamu sedang dalam tekanan cukup berat. Jangan ragu konsultasi dengan profesional."}
                     </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/appointments" className="btn-primary">
                             {cat.category.includes('Berat') ? 'Jadwalkan Konsultasi Darurat' : 'Buat Janji Temu'}
                        </Link>
                         <Link to="/dashboard" className="btn-secondary">
                             Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
                
                 <div className="text-center">
                    <Link to="/daily-check/history" className="text-primary hover:text-primary-dark underline font-medium">Lihat Riwayat Saya</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F0F4F8] -mt-8 -mx-4 sm:-mx-8 p-4 sm:p-10">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mb-4 text-primary">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">Cek Kesehatan Mental</h1>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                        Jawab pertanyaan di bawah dengan jujur untuk mengetahui tingkat stres Anda hari ini.
                    </p>
                </div>

                <form onSubmit={submitFeedback} className="card bg-white shadow-2xl border-none p-8 sm:p-12 rounded-[3rem] space-y-12 animate-fade-in-up">
                    {questionnaire.map((q, qIndex) => (
                        <div key={qIndex} className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 leading-snug">
                                {qIndex + 1}. {q.question}
                            </h3>
                            <div className="space-y-4">
                                {q.options.map((option, oIndex) => (
                                    <label 
                                        key={oIndex}
                                        className={`flex items-start gap-4 p-2 -ml-2 rounded-2xl cursor-pointer group transition-all hover:bg-gray-50`}
                                    >
                                        <div className="relative flex items-center mt-1 shrink-0">
                                            <input 
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                value={option.score}
                                                required
                                                checked={answers[qIndex] === option.score}
                                                onChange={() => handleOptionChange(qIndex, option.score)}
                                                className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:border-primary transition-all cursor-pointer"
                                            />
                                            <div className="absolute inset-0 m-auto w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-base font-medium leading-relaxed transition-colors ${
                                            answers[qIndex] === option.score ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-800'
                                        }`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="pt-8">
                        <button 
                            disabled={loading || answers.includes(null)}
                            className="btn-primary w-full py-5 text-xl font-black shadow-xl shadow-primary/40 rounded-3xl"
                        >
                            {loading ? 'Menyimpan...' : 'Selesai & Lihat Hasil ✨'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
