<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GamesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('games')->insert([
            ['name' => 'Tic-Tac-Toe', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Wordle', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pong', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Guess Card', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Arkanoid', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Connect 4', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
