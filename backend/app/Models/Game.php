<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Game extends Model
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'id_game';

    protected $fillable = [
        'name',
    ];
}
