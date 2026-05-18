<?php

namespace Database\Factories;

use App\Models\Stat;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
/**
 * @extends Factory<Model>
 */
class StatFactory extends Factory
{
    protected $model = \App\Models\Stat::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $victorias = fake()->numberBetween(0, 50);
        $derrotas = fake()->numberBetween(0, 50);
        
        return [
            'id_user' => null, 
            'id_game' => null,
            'wins' => $victorias,
            'losses' => $derrotas,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
