<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(GamesSeeder::class);

        $juegos = \App\Models\Game::all();
        $canales = \App\Models\Channel::all();
        $usuarios = \App\Models\User::factory(25)->create();

        //Crear usuarios con las stats de los juegos
        foreach ($usuarios as $user) {
            foreach ($juegos as $game) {
                \App\Models\Stat::factory()->create([
                    'id_user' => $user->id_user,
                    'id_game' => $game->id_game,
                ]);
            }
        }

        $this->call([
            ChannelsSeeder::class,
        ]);

        //Crear mensajes
        for ($i = 0; $i < 50; $i++) {
            \App\Models\Message::factory()->create([
                'id_user' => $usuarios->random()->id_user,
                'id_channel' => 1,
            ]);
        }

        //Crear partidas
        for ($i = 0; $i < 50; $i++) {
            $players = $usuarios->random(2);
            $ganador = $players->random();

            $match = \App\Models\Match_::factory()->create([
                'id_game'   => $juegos->random()->id_game,
                'id_winner' => $ganador->id_user,
            ]);

            foreach ($players as $player) {
                \App\Models\Match_User::factory()->create([
                    'id_match' => $match->id_match,
                    'id_user'  => $player->id_user,
                    // Si quieres que el ganador tenga más puntos siempre:
                    'points'   => ($player->id_user === $ganador->id_user) ? rand(51, 100) : rand(0, 50),
                ]);
            }
        }

    }
}
