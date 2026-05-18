<?php

namespace Database\Factories;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Model>
 */
class Match_UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date'   => now(),
            'points' => fake()->numberBetween(0, 50),
            'id_match' => null,
            'id_user'  => null,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
