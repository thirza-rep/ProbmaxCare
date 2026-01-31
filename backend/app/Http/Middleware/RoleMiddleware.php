<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            \Log::warning('RoleMiddleware: User not authenticated');
            return response()->json([
                'message' => 'Unauthorized - Please login first'
            ], 401);
        }

        $userRole = $request->user()->role_id;

        \Log::info('RoleMiddleware: Checking role', [
            'user_id' => $request->user()->id,
            'user_role' => $userRole,
            'required_roles' => $roles
        ]);

        // Convert role names to IDs if needed
        $allowedRoleIds = [];
        foreach ($roles as $role) {
            if (is_numeric($role)) {
                $allowedRoleIds[] = (int) $role;
            } else {
                // Map role names to IDs
                $roleMap = [
                    'admin' => 1,
                    'consultant' => 2,
                    'konsultan' => 2,
                    'user' => 3,
                    'mahasiswa' => 3,
                ];
                if (isset($roleMap[strtolower($role)])) {
                    $allowedRoleIds[] = $roleMap[strtolower($role)];
                }
            }
        }

        if (!in_array($userRole, $allowedRoleIds)) {
            \Log::warning('RoleMiddleware: Access denied', [
                'user_id' => $request->user()->id,
                'user_role' => $userRole,
                'required_roles' => $allowedRoleIds
            ]);

            return response()->json([
                'message' => 'Forbidden - You do not have permission to access this resource'
            ], 403);
        }

        return $next($request);
    }
}
