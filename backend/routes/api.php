<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MailController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Lederboard
Route::get('/users/leaderboard', [UserController::class, 'getLeaderboard'])->middleware('auth:sanctum'); //https//localhost/api/users/leaderboard

//Login y logout
Route::post('/login', [AuthController::class, 'login']); //https//localhost/api/login?email=Claudio@gmail.com&password=123456
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); //https//localhost/api/logout

//Users
Route::post('/users', [UserController::class, 'store']); //https//localhost/api/users
Route::get('/users', [UserController::class, 'index']); //https//localhost/api/users/
Route::put('/users/{id}', [UserController::class, 'update']); //https//localhost/api/users/1?name=aaaaa&nick=cacscacsac
Route::put('/users/{id}/password', [UserController::class, 'updatePassword']); //https//localhost/api/users/1/password?password=9876543
Route::get('/users/{id_user}', [UserController::class, 'show']); //https//localhost/api/users/2
Route::get('/users/{id_user}/stats', [UserController::class, 'getWinsLossesEachGame']); //https//localhost/api/users/1/stats
Route::get('/users/{id}/stats/totals', [UserController::class, 'getTotalWinsLosses']); //https//localhost/api/users/9/stats/totals
Route::delete('/users/{id}', [UserController::class, 'destroy']); //https//localhost/api/users/25
Route::get('/users/by-email/{email}', [UserController::class, 'getIdByEmail']);

//Games
Route::get('/games', [GameController::class, 'index']); //https//localhost/api/games/

//Mail
Route::post('/send-recovery-code', [MailController::class, 'sendRecoveryCode']); //https//localhost/api/send-recovery-code?email=c@gmail.com
Route::post('/verify-code', [MailController::class, 'verifyCode']); //https//localhost/api/verify-code?email=claudiojaloara@gmail.com&code=592345