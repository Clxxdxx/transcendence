<?php

namespace Database\Factories;

use App\Models\Match_;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Match_>
 */
class Match_Factory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $inicio = fake()->dateTimeBetween('-1 month', 'now');
        $fin = (clone $inicio)->modify('+' . rand(10, 60) . ' minutes');

        return [
            'id_game'   => null, //se llena luego
            'id_winner' => null, //se llena luego
            'init_date' => $inicio,
            'end_date'  => $fin,
        ];
    }
}
