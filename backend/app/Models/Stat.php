<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Stat extends Model
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'id_stat';

    protected $fillable = [
        'id_game',
        'id_user',
        'wins',
        'losses',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function game()
    {
        return $this->belongsTo(Game::class, 'id_game');
    }
}
