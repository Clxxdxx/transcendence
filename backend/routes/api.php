<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Login
Route::post('/login', [AuthController::class, 'login']);

//Users
Route::post('/users', [UserController::class, 'store']); //http://localhost:8080/api/users
Route::get('/users', [UserController::class, 'index']); //http://localhost:8080/api/users/
Route::put('/users/{id}', [UserController::class, 'update']); //http://localhost:8080/api/users/1?name=aaaaa&nick=cacscacsac
Route::put('/users/{id}/password', [UserController::class, 'updatePassword']); //http://localhost:8080/api/users/1/password?password=9876543
Route::get('/users/{id_user}', [UserController::class, 'show']); //http://localhost:8080/api/users/2
Route::get('/users/{id_user}/stats', [UserController::class, 'getWinsLossesEachGame']); //http://localhost:8080/api/users/1/stats
Route::get('/users/{id}/stats/totals', [UserController::class, 'getTotalWinsLosses']); //http://localhost:8080/api/users/9/stats/totals

//Games
Route::get('/games', [GameController::class, 'index']); //http://localhost:8080/api/games/
