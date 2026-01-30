import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const questions = [
  "Saya merasa tegang atau cemas.",
  "Saya merasa sedih atau murung.",
  "Saya merasa mudah marah atau tersinggung.",
  "Saya merasa sulit berkonsentrasi.",
  "Saya merasa tidak berharga atau tidak berguna.",
  "Saya merasa sulit tidur atau tidur tidak nyenyak.",
  "Saya merasa lelah atau tidak bertenaga.",
  "Saya kehilangan minat pada hal-hal yang biasanya saya sukai.",
  "Saya merasa putus asa tentang masa depan.",
  "Saya merasa sulit untuk rileks."
];

const optionLabels = ["Tidak Pernah", "Jarang", "Sering", "Selalu"];

// Helper to determine score color/category locally (sync with backend logic preferably)
const getResultCategory = (score) => {
    if (score <= 10) return { category: 'Normal', color: 'bg-green-100 text-green-800', border: 'border-green-500', icon: '😊' };
    if (score <= 20) return { category: 'Stres Ringan', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500', icon: '😐' };
    if (score <= 30) return { category: 'Stres Sedang', color: 'bg-orange-100 text-orange-800', border: 'border-orange-500', icon: '😟' };
    return { category: 'Stres Berat', color: 'bg-red-100 text-red-800', border: 'border-red-500', icon: '😰' };
};

export default function DailyFeedback() {
    const { setNotification } = useStateContext();
    const [answers, setAnswers] = useState(Array(10).fill(null)); // Initialize with null
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(0); // Current question index
    const [submitted, setSubmitted] = useState(false);

    const handleOptionChange = (value) => {
        const newAnswers = [...answers];
        newAnswers[step] = value;
        setAnswers(newAnswers);
        
        // Auto advance after short delay
        if (step < 9) {
            setTimeout(() => setStep(s => s + 1), 200);
        }
    };

    const submitFeedback = (ev) => {
        ev.preventDefault();
        
        // Check if all answered
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

    const progress = ((step) / 10) * 100;

    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-center text-primary-dark mb-2">Cek Kesehatan Mental</h1>
            <p className="text-center text-gray-500 mb-8">Jawab jujur sesuai perasaanmu hari ini.</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${((step + (answers[step] !== null ? 1 : 0)) / 10) * 100}%` }}></div>
            </div>

            <div className="card min-h-[400px] flex flex-col justify-between relative shadow-lg">
                 {/* Navigation Arrows (Optional, simplified for now) */}
                 
                 <div className="flex-1 flex flex-col justify-center">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">Pertanyaan {Math.min(step + 1, 10)} dari 10</span>
                     <h2 className="text-2xl font-medium text-gray-800 mb-8 leading-snug">
                         {questions[step]}
                     </h2>

                     <div className="space-y-3">
                         {optionLabels.map((label, index) => (
                             <button
                                 key={index}
                                 onClick={() => handleOptionChange(index)}
                                 className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                                     answers[step] === index 
                                     ? 'border-primary bg-primary/5 text-primary' 
                                     : 'border-gray-100 hover:border-primary/50 hover:bg-gray-50'
                                 }`}
                             >
                                 <span className="font-medium">{label}</span>
                                 {answers[step] === index && <span className="text-primary text-xl">✓</span>}
                             </button>
                         ))}
                     </div>
                 </div>
                 
                 <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                     <button 
                        onClick={() => setStep(s => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className={`text-gray-500 font-medium px-4 py-2 rounded hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed`}
                     >
                         ← Sebelumnya
                     </button>

                     {step < 9 ? (
                         <button 
                            onClick={() => setStep(s => Math.min(9, s + 1))}
                            disabled={answers[step] === null}
                            className="bg-gray-800 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                             Lanjut →
                         </button>
                     ) : (
                         <button 
                            onClick={submitFeedback}
                            disabled={loading || answers.includes(null)}
                            className="btn-primary"
                         >
                             {loading ? 'Menyimpan...' : 'Selesai & Lihat Hasil'}
                         </button>
                     )}
                 </div>
            </div>
        </div>
    );
}
