<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Match_User extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'match_user';
    protected $primaryKey = 'id_match_user';

    protected $fillable = [
        'id_match',
        'id_user',
        'date',
        'points',
    ];
}
