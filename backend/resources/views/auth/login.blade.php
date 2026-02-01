@extends('layouts.auth')

@section('title', 'Masuk')

@section('content')
    <div class="w-full max-w-md animate-fade-in">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-4">
                <span class="text-4xl">🌿</span>
            </div>
            <h1 class="text-4xl font-bold text-white mb-2">ProbmaxCare</h1>
            <p class="text-purple-100">Edukasi Kesehatan Mental Mahasiswa</p>
        </div>

        <!-- Login Card -->
        <div class="card-glass rounded-3xl shadow-2xl p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Selamat Datang! 👋</h2>
            <p class="text-gray-600 mb-6">Masuk untuk melanjutkan</p>

            @if ($errors->any())
                <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                        <div>
                            @foreach ($errors->all() as $error)
                                <p class="text-sm text-red-700">{{ $error }}</p>
                            @endforeach
                        </div>
                    </div>
                </div>
            @endif

            @if (session('success'))
                <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-sm text-green-700">{{ session('success') }}</p>
                    </div>
                </div>
            @endif

            <form action="{{ route('login') }}" method="POST" class="space-y-5">
                @csrf

                <div>
                    <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                        Username atau Email
                    </label>
                    <input type="text" id="username" name="username" value="{{ old('username') }}"
                        class="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                        placeholder="Masukkan username atau email" required autofocus>
                </div>

                <div>
                    <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input type="password" id="password" name="password"
                        class="input-field w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                        placeholder="Masukkan password" required>
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" name="remember"
                            class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                        <span class="ml-2 text-sm text-gray-600">Ingat saya</span>
                    </label>
                    {{-- <a href="{{ route('password.request') }}"
                        class="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                        Lupa password?
                    </a> --}}
                </div>

                <button type="submit" class="btn-primary w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg">
                    Masuk
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-gray-600 text-sm">
                    Belum punya akun?
                    <a href="{{ route('register') }}"
                        class="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
                        Daftar di sini
                    </a>
                </p>
            </div>
        </div>

        <!-- Footer Note -->
        <div class="mt-6 text-center">
            <p class="text-purple-100 text-sm">
                Dengan masuk, kamu menyetujui untuk menjaga privasi dan keamanan akunmu.
            </p>
        </div>
    </div>
@endsection