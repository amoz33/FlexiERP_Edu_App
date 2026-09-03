<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name'      => 'Super Admin',
                'email'     => 'admin@flexierp.com',
                'password'  => Hash::make('Admin@1234'),
                'role'      => 'admin',
                'school_id' => 'SCH-001',
                'is_active' => true,
            ],
            [
                'name'      => 'Test Teacher',
                'email'     => 'teacher@flexierp.com',
                'password'  => Hash::make('Teacher@1234'),
                'role'      => 'teacher',
                'school_id' => 'SCH-001',
                'is_active' => true,
            ],
            [
                'name'      => 'Test Student',
                'email'     => 'student@flexierp.com',
                'password'  => Hash::make('Student@1234'),
                'role'      => 'student',
                'school_id' => 'SCH-001',
                'is_active' => true,
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(['email' => $data['email']], $data);
        }

        $this->command->info('Test users seeded successfully.');
    }
}
