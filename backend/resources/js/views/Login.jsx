import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setErrors(null);

    const payload = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient.post('/login', payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors || { general: [response.data.message] });
        } else {
          setErrors({ general: ['Terjadi kesalahan. Silakan coba lagi.'] });
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-secondary-light px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ProbmaxCare</h1>
          <p className="text-gray-600">Edukasi Kesehatan Mental Mahasiswa</p>
        </div>

        {/* Login Card */}
        <div className="card shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Masuk</h2>
          <p className="text-gray-500 mb-6">Selamat datang kembali! 👋</p>

          {errors && (
            <div className="alert-error mb-6 animate-fade-in-down">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                {Object.keys(errors).map((key) => (
                  <p key={key} className="text-sm">{errors[key][0]}</p>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label">Username atau Email</label>
              <input
                ref={usernameRef}
                type="text"
                className="input-field"
                placeholder="Masukkan username atau email"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                ref={passwordRef}
                type="password"
                className="input-field"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 spinner"></div>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Dengan masuk, kamu menyetujui untuk menjaga privasi dan keamanan akunmu.
          </p>
        </div>
      </div>
    </div>
  );
}
