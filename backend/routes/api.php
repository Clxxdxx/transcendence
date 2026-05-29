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

//Login y logout
Route::post('/login', [AuthController::class, 'login']); //http://localhost:8080/api/login?email=Claudio@gmail.com&password=123456
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); //http://localhost:8080/api/logout

//Users
Route::post('/users', [UserController::class, 'store']); //http://localhost:8080/api/users
Route::get('/users', [UserController::class, 'index']); //http://localhost:8080/api/users/
Route::put('/users/{id}', [UserController::class, 'update']); //http://localhost:8080/api/users/1?name=aaaaa&nick=cacscacsac
Route::put('/users/{id}/password', [UserController::class, 'updatePassword']); //http://localhost:8080/api/users/1/password?password=9876543
Route::get('/users/{id_user}', [UserController::class, 'show']); //http://localhost:8080/api/users/2
Route::get('/users/{id_user}/stats', [UserController::class, 'getWinsLossesEachGame']); //http://localhost:8080/api/users/1/stats
Route::get('/users/{id}/stats/totals', [UserController::class, 'getTotalWinsLosses']); //http://localhost:8080/api/users/9/stats/totals
Route::delete('/users/{id}', [UserController::class, 'destroy']); //http://localhost:8080/api/users/25
Route::get('/users/by-email/{email}', [UserController::class, 'getIdByEmail']);

//Games
Route::get('/games', [GameController::class, 'index']); //http://localhost:8080/api/games/

//Mail
Route::post('/send-recovery-code', [MailController::class, 'sendRecoveryCode']); //http://localhost:8080/api/send-recovery-code?email=c@gmail.com
Route::post('/verify-code', [MailController::class, 'verifyCode']);