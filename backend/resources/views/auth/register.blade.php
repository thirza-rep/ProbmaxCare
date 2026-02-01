@extends('layouts.auth')

@section('title', 'Daftar Akun')

@section('content')
    <div class="w-full max-w-md animate-fade-in">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-4">
                <span class="text-4xl">🌿</span>
            </div>
            <h1 class="text-4xl font-bold text-white mb-2">ProbmaxCare</h1>
            <p class="text-purple-100">Mulai perjalanan kesehatan mentalmu</p>
        </div>

        <!-- Register Card -->
        <div class="card-glass rounded-3xl shadow-2xl p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Bergabunglah! 🚀</h2>
            <p class="text-gray-600 mb-6">Buat akun baru untuk memulai</p>

            @if ($errors->any())
                <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                        <div class="flex-1">
                            @foreach ($errors->all() as $error)
                                <p class="text-sm text-red-700">{{ $error }}</p>
                            @endforeach
                        </div>
                    </div>
                </div>
            @endif

            <form action="{{ route('register') }}" method="POST" class="space-y-5">
                @csrf

                <div>
                    <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                        Username
                    </label>
                    <input type="text" id="username" name="username" value="{{ old('username') }}"
                        class="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                        placeholder="Pilih username unik" required autofocus>
                </div>

                <div>
                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}"
                        class="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                        placeholder="email@example.com" required>
                </div>

                <div>
                    <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input type="password" id="password" name="password"
                        class="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                        placeholder="Minimal 6 karakter" required>
                </div>

                <div>
                    <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-2">
                        Konfirmasi Password
                    </label>
                    <input type="password" id="password_confirmation" name="password_confirmation"
                        class="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                        placeholder="Ketik ulang password" required>
                </div>

                <button type="submit" class="btn-primary w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg">
                    Daftar Sekarang
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-gray-600 text-sm">
                    Sudah punya akun?
                    <a href="{{ route('login') }}"
                        class="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
                        Masuk di sini
                    </a>
                </p>
            </div>
        </div>

        <!-- Footer Note -->
        <div class="mt-6 text-center">
            <p class="text-purple-100 text-sm">
                Dengan mendaftar, kamu menyetujui untuk menjaga privasi dan keamanan data pribadimu.
            </p>
        </div>
    </div>
@endsection