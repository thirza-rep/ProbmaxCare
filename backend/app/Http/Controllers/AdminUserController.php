<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Traits\ApiResponser;

class AdminUserController extends Controller
{
    use ApiResponser;

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->user()->role_id !== 1) {
                return $this->errorResponse('Unauthorized. Admin only.', 403);
            }
            return $next($request);
        });
    }

    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::with('role')->get();
        return $this->successResponse($users);
    }

    /**
     * Display a listing of the roles.
     */
    public function roles()
    {
        $roles = Role::all();
        return $this->successResponse($roles);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|unique:users,username|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $data['role_id'],
        ]);

        return $this->successResponse($user->load('role'), 'User created successfully', 201);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->username = $data['username'];
        $user->email = $data['email'];
        if (isset($data['password']) && !empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->role_id = $data['role_id'];
        $user->save();

        return $this->successResponse($user->load('role'), 'User updated successfully');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return $this->successResponse(null, 'User deleted successfully');
    }
}