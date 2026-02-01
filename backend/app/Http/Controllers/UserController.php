<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Traits\ApiResponser;

class UserController extends Controller
{
    use ApiResponser;
    // List all users (Admin only)
    public function index()
    {
        return $this->successResponse(User::with('role')->orderBy('created_at', 'desc')->get());
    }

    // Update user role (Admin only)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        $user->role_id = $request->role_id;
        $user->save();

        return $this->successResponse($user->load('role'), 'User role updated successfully');
    }
}