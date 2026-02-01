<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProbmaxCare - Edukasi Kesehatan Mental Mahasiswa</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .card-hover {
            transition: all 0.3s ease;
        }

        .card-hover:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: white;
            color: #667eea;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(255, 255, 255, 0.3);
        }
    </style>
</head>

<body class="min-h-screen gradient-bg">
    <!-- Hero Section -->
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
        <div class="max-w-5xl mx-auto text-center">
            <!-- Logo -->
            <div class="mb-8 animate-bounce">
                <div class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl">
                    <span class="text-5xl">🌿</span>
                </div>
            </div>

            <!-- Main Heading -->
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Selamat Datang di<br>
                <span class="bg-white text-transparent bg-clip-text">ProbmaxCare</span>
            </h1>

            <p class="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto">
                Platform edukasi kesehatan mental untuk mahasiswa.
                Dapatkan dukungan, konseling, dan resources untuk kesejahteraan mentalmu.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <a href="{{ route('login') }}"
                    class="btn-primary px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-xl">
                    Masuk Sekarang →
                </a>
                <a href="{{ route('register') }}"
                    class="btn-secondary px-8 py-4 rounded-2xl font-bold text-lg shadow-xl">
                    Daftar Gratis
                </a>
            </div>

            <!-- Features -->
            <div class="grid md:grid-cols-3 gap-6 mt-16">
                <div
                    class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 card-hover border border-white border-opacity-20">
                    <div class="text-4xl mb-4">📊</div>
                    <h3 class="text-xl font-bold text-white mb-2">Daily Check-In</h3>
                    <p class="text-purple-100">Pantau kondisi mental harianmu dengan sistem tracking yang mudah</p>
                </div>

                <div
                    class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 card-hover border border-white border-opacity-20">
                    <div class="text-4xl mb-4">💬</div>
                    <h3 class="text-xl font-bold text-white mb-2">Konseling Online</h3>
                    <p class="text-purple-100">Buat janji temu dengan konsultan kesehatan mental profesional</p>
                </div>

                <div
                    class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 card-hover border border-white border-opacity-20">
                    <div class="text-4xl mb-4">🤖</div>
                    <h3 class="text-xl font-bold text-white mb-2">AI Assistant</h3>
                    <p class="text-purple-100">Dapatkan dukungan 24/7 dari AI chatbot yang siap mendengarkan</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
                <div class="text-center">
                    <div class="text-4xl font-black text-white mb-2">100+</div>
                    <div class="text-purple-100">Mahasiswa Terdaftar</div>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-black text-white mb-2">50+</div>
                    <div class="text-purple-100">Sesi Konseling</div>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-black text-white mb-2">24/7</div>
                    <div class="text-purple-100">Dukungan Tersedia</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="text-center pb-8">
        <p class="text-purple-100 text-sm">
            &copy; {{ date('Y') }} ProbmaxCare. Kesehatan mentalmu adalah prioritas kami.
        </p>
    </div>
</body>

</html>