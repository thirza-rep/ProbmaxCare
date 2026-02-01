<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Traits\ApiResponser;

class AuthController extends Controller
{
    use ApiResponser;
    public function register(Request $request)
    {
        try {
            $fields = $request->validate([
                'username' => 'required|string|unique:users,username',
                'email' => 'required|string|email|unique:users,email',
                'password' => 'required|string|confirmed|min:6'
            ]);

            $user = User::create([
                'username' => $fields['username'],
                'email' => $fields['email'],
                'password' => bcrypt($fields['password']),
                'role_id' => 3 // User role by default
            ]);

            // Load role relationship
            $user->load('role');

            $token = $user->createToken('probmaxcare_token')->plainTextToken;

            \Log::info('User registered', [
                'user_id' => $user->id,
                'username' => $user->username,
                'role_id' => $user->role_id
            ]);

            return $this->successResponse([
                'user' => $user,
                'token' => $token
            ], 'Registrasi berhasil', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            \Log::error('Registration error', [
                'message' => $e->getMessage()
            ]);
            return $this->errorResponse('Terjadi kesalahan saat mendaftar. Silakan coba lagi.', 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $fields = $request->validate([
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            \Log::info('Login attempt', ['username' => $fields['username']]);

            // Check email or username - load with role relationship
            $user = User::with('role')
                ->where('username', $fields['username'])
                ->orWhere('email', $fields['username'])
                ->first();

            if (!$user) {
                \Log::warning('Login failed - user not found', ['username' => $fields['username']]);
                return $this->errorResponse('Username atau email tidak ditemukan', 401);
            }

            if (!Hash::check($fields['password'], $user->password)) {
                \Log::warning('Login failed - wrong password', ['user_id' => $user->id]);
                return $this->errorResponse('Password salah', 401);
            }

            // Create token
            $token = $user->createToken('probmaxcare_token')->plainTextToken;

            // Ensure role is loaded
            if (!$user->relationLoaded('role')) {
                $user->load('role');
            }

            \Log::info('Login successful', [
                'user_id' => $user->id,
                'username' => $user->username,
                'role_id' => $user->role_id,
                'role_name' => $user->role ? $user->role->name : 'Unknown'
            ]);

            return $this->successResponse([
                'user' => $user,
                'token' => $token
            ], 'Login berhasil');

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Login validation error', ['errors' => $e->errors()]);
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            \Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Terjadi kesalahan pada server. Silakan coba lagi.', 500);
        }
    }

    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();
        return [
            'message' => 'Logged out'
        ];
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return $this->unauthorizedResponse();
        }

        $fields = $request->validate([
            'username' => 'required|string|unique:users,username,' . $user->id,
            'email' => 'required|string|unique:users,email,' . $user->id,
            'password' => 'nullable|string|confirmed'
        ]);

        $user->username = $fields['username'];
        $user->email = $fields['email'];
        if ($request->filled('password')) {
            $user->password = bcrypt($fields['password']);
        }
        $user->save();

        return $this->successResponse($user, 'Profile updated successfully');
    }

    // ==========================================
    // WEB AUTHENTICATION METHODS
    // ==========================================

    /**
     * Show login form
     */
    public function showLogin()
    {
        return view('auth.login');
    }

    /**
     * Show register form
     */
    public function showRegister()
    {
        return view('auth.register');
    }

    /**
     * Handle web login request
     */
    public function webLogin(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Try to find user by username or email
        $user = User::where('username', $credentials['username'])
            ->orWhere('email', $credentials['username'])
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'username' => 'Username/email atau password salah.',
            ])->withInput($request->only('username'));
        }

        // Login user dengan session
        Auth::login($user, $request->filled('remember'));

        $request->session()->regenerate();

        // Redirect ke dashboard (yang akan redirect ke Vite SPA)
        return redirect()->intended('/dashboard');
    }

    /**
     * Handle web registration request
     */
    public function webRegister(Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|unique:users,username',
                'email' => 'required|string|email|unique:users,email',
                'password' => 'required|string|confirmed|min:6'
            ]);

            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role_id' => 3 // User role by default
            ]);

            \Log::info('User registered via web', [
                'user_id' => $user->id,
                'username' => $user->username,
            ]);

            return redirect()
                ->route('login')
                ->with('success', 'Registrasi berhasil! Silakan login dengan akun barumu. ✨');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput($request->only('username', 'email'));
        } catch (\Exception $e) {
            \Log::error('Web registration error', [
                'message' => $e->getMessage()
            ]);

            return back()
                ->withErrors(['error' => 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'])
                ->withInput($request->only('username', 'email'));
        }
    }

    /**
     * Handle web logout request
     */
    public function webLogout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}