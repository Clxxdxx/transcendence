<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            Log::warning('login.failed', [
                'email' => $request->email,
                'ip'    => $request->ip(),
            ]);
            return response()->json([
                'message' => 'Credenciales invalidas'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();
        Log::info('login.success', [
            'user_id' => $user->id_user,
            'nick'    => $user->nick,
            'ip'      => $request->ip(),
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        Log::info('logout', [
            'user_id' => $user->id_user,
            'nick'    => $user->nick,
            'ip'      => $request->ip(),
        ]);
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesion cerrada correctamente'
        ], 200);
    }

}
