<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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

            return response([
                'user' => $user,
                'token' => $token,
                'message' => 'Registrasi berhasil'
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response([
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Registration error', [
                'message' => $e->getMessage()
            ]);
            return response([
                'message' => 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
            ], 500);
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
                return response([
                    'message' => 'Username atau email tidak ditemukan'
                ], 401);
            }

            if (!Hash::check($fields['password'], $user->password)) {
                \Log::warning('Login failed - wrong password', ['user_id' => $user->id]);
                return response([
                    'message' => 'Password salah'
                ], 401);
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

            return response([
                'user' => $user,
                'token' => $token,
                'message' => 'Login berhasil'
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Login validation error', ['errors' => $e->errors()]);
            return response([
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response([
                'message' => 'Terjadi kesalahan pada server. Silakan coba lagi.'
            ], 500);
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
            return response(['message' => 'Unauthorized'], 401);
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

        return response([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
