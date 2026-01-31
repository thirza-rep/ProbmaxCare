<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Roles
        \App\Models\Role::create(['name' => 'Admin']);      // 1
        \App\Models\Role::create(['name' => 'Consultant']); // 2
        \App\Models\Role::create(['name' => 'Student']);    // 3

        // Create Admin User
        \App\Models\User::create([
            'username' => 'admin',
            'email' => 'admin@probmax.com',
            'password' => bcrypt('password'),
            'role_id' => 1
        ]);

        // Create Consultant User
        \App\Models\User::create([
            'username' => 'dosen',
            'email' => 'dosen@probmax.com',
            'password' => bcrypt('password'),
            'role_id' => 2
        ]);

        // Create Student User
        \App\Models\User::create([
            'username' => 'mahasiswa',
            'email' => 'mahasiswa@probmax.com',
            'password' => bcrypt('password'),
            'role_id' => 3
        ]);
    }
}
