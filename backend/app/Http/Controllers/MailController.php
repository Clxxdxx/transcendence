<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\CodeMailable;
use Illuminate\Support\Facades\Cache;

class MailController extends Controller
{
    public function sendRecoveryCode(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        
        $code = rand(100000, 999999);
        Log::warning('password.recovery_requested', [
            'email' => $request->email,
            'ip'    => $request->ip(),
        ]);
        //guardar el correo 10 mins
        Cache::put('recovery_code_' . $request->email, $code, now()->addMinutes(10));
        
        //Send code
        Mail::to($request->email)->send(new CodeMailable($code));
        
        return response()->json(['message' => 'Código enviado a tu correo']);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric'
        ]);

        $cachedCode = Cache::get('recovery_code_' . $request->email);

        if ($cachedCode && $cachedCode == $request->code) {
            Log::info('password.recovery_verified', [
                'email' => $request->email,
                'ip'    => $request->ip(),
            ]);
            return response()->json(['message' => 'Código correcto'], 200);
        }

        Log::warning('password.recovery_failed', [
            'email' => $request->email,
            'ip'    => $request->ip(),
        ]);
        return response()->json(['message' => 'Código incorrecto o expirado'], 422);
    }
}