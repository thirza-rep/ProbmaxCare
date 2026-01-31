import { Link } from "react-router-dom";
import { useState } from "react";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: "🧠",
      title: "PMC Game",
      description: "Isi hasi menarik, cari tahu mood kamu hari ini, dan temukan aktivitas seru buat ngisi waktu!",
      color: "from-blue-400 to-cyan-400",
      image: "🎮"
    },
    {
      icon: "📋",
      title: "Cek Kesehatan Mental",
      description: "Isi pertanyaan singkat tentang kondisi mental kamu. Simpel, cepat, dan bermakna!",
      color: "from-purple-400 to-pink-400",
      image: "🧘"
    },
    {
      icon: "💬",
      title: "LiveChat AI",
      description: "Curhat sama AI yang siap mendengarkan 24/7. Privasi terjaga, dukungan selalu ada!",
      color: "from-green-400 to-teal-400",
      image: "🤖"
    },
    {
      icon: "📅",
      title: "Buat Janji Konseling",
      description: "Butuh bantuan profesional? Jadwalkan sesi konseling dengan dosen atau psikolog kami!",
      color: "from-orange-400 to-red-400",
      image: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl md:text-3xl">🌱</div>
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ProbmaxCare
              </span>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Link to="/login" className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs md:text-sm">
                Masuk
              </Link>
              <Link to="/register" className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg transition-all text-xs md:text-sm">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24">
        <div className="text-center animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-sm font-bold uppercase tracking-wider">
              Platform Edukasi Kesehatan Mental
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-800 mb-6 leading-[1.1]">
            Hai, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mahasiswa!</span> 👋
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Selamat datang di <strong className="text-primary-dark">ProbmaxCare</strong>! Kami di sini untuk mendukungmu. 
            Jelajahi fitur-fitur seru dan mari bagi berbagai cerita dengan kami. 
            Ingat, kamu nggak sendirian! 💚
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn-primary btn-lg w-full sm:w-auto shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 text-sm md:text-base">
              Mulai Sekarang 🚀
            </Link>
            <a href="#features" className="btn-outline btn-lg w-full sm:w-auto text-sm md:text-base">
              Lihat Fitur
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-8 max-w-2xl mx-auto mt-12 md:mt-20">
            <div className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white shadow-sm">
              <div className="text-2xl md:text-4xl font-black text-primary">4</div>
              <div className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-tighter sm:tracking-normal mt-1">Fitur</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white shadow-sm">
              <div className="text-2xl md:text-4xl font-black text-secondary">24/7</div>
              <div className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-tighter sm:tracking-normal mt-1">Chat AI</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white shadow-sm">
              <div className="text-2xl md:text-4xl font-black text-accent-green">100%</div>
              <div className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-tighter sm:tracking-normal mt-1">Gratis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Fitur Keren Kami</h2>
            <p className="text-gray-600 text-lg">Berbagai fitur untuk mendukung kesehatan mentalmu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 hover:-translate-y-2 transition-all cursor-pointer group border-2 border-transparent hover:border-primary/20"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-primary-light to-secondary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-black text-gray-800 mb-6">Tentang Kami</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Universitas Respati Yogyakarta</h3>
                    <p className="text-sm">
                      ProbmaxCare dikembangkan oleh mahasiswa Universitas Respati Yogyakarta Fakultas Ilmu Kesehatan Program Studi Keperawatan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Tujuan Kami</h3>
                    <p className="text-sm">
                      Membantu mahasiswa keperawatan memahami dan mengelola kesehatan mental mereka melalui edukasi dan dukungan yang mudah diakses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    💚
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Komitmen Kami</h3>
                    <p className="text-sm">
                      Menyediakan platform yang aman, privat, dan suportif untuk semua mahasiswa yang membutuhkan bantuan terkait kesehatan mental.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-8xl">
                🌱
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-black mb-4">Siap untuk Memulai?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ProbmaxCare dan jaga kesehatan mentalmu bersama kami!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all transform hover:scale-105">
              Daftar Sekarang
            </Link>
            <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary transition-all">
              Sudah Punya Akun?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🌱</div>
                <span className="text-2xl font-black">ProbmaxCare</span>
              </div>
              <p className="text-gray-400 text-sm">
                Platform edukasi kesehatan mental untuk mahasiswa keperawatan.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Fitur</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>PMC Game</li>
                <li>Cek Kesehatan Mental</li>
                <li>LiveChat AI</li>
                <li>Buat Janji Konseling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Kontak</h3>
              <p className="text-sm text-gray-400">
                Universitas Respati Yogyakarta<br />
                Fakultas Ilmu Kesehatan<br />
                Program Studi Keperawatan
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 ProbmaxCare. All rights reserved. Made with 💚 for mental health awareness.
          </div>
        </div>
      </footer>
    </div>
  );
}
