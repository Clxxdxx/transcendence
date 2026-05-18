<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Match_ extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'matches';
    protected $primaryKey = 'id_match';

    protected $fillable = [
        'id_game',
        'init_date',
        'end_date',
        'id_winner',
    ];

    public function winner() {
        return $this->belongsTo(User::class, 'id_winner');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'match_user', 'id_match', 'id_user')
                    ->withPivot('points');
    }
}
