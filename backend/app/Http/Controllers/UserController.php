<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Stat;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validar
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'nick' => 'required|string|max:255|unique:users,nick',
            'password' => 'required|string|min:6',
        ]);

        //crear
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nick' => $validated['nick'],
            'password' => Hash::make($validated['password']),
            'registration_date' => now()->toDateString(),
            'points' => 0,
        ]);

        return response()->json([
            'message' => "User created successfully",
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return response()->json($user, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'nick' => 'sometimes|required|string|max:255|unique:users,nick,' . $id . ',id_user',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => "User updated successfully",
            'user' => $user
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente'
        ], 200);
    }

    public function getWinsLossesEachGame(string $id)
    {
        $stats = Stat::where('id_user', $id)
            ->with('game:id_game,name') //solo el id y el nombre
            ->get()
            ->map(function ($stat) {
                //Mapear el resultado
                return [
                    'GameName' => $stat->game->name,
                    'Wins' => $stat->wins,
                    'Losses' => $stat->losses,
                ];
            });

        return response()->json($stats, 200);
    }

    public function getTotalWinsLosses(string $id)
    {
        $totals = Stat::where('id_user', $id)
                //COALESCE: si no hay partidas registradas, es 0
                ->selectRaw('COALESCE(SUM(wins), 0) as TotalWins, COALESCE(SUM(losses), 0) as TotalLosses')
                ->first();

            return response()->json($totals, 200);
    }

    public function updatePassword(Request $request, string $id)
{
    $user = User::findOrFail($id);

    $validated = $request->validate([
        'password' => 'required|string|min:6',
    ]);

    $user->update([
        'password' => Hash::make($validated['password'])
    ]);

    return response()->json([
        'message' => "Password updated successfully"
    ], 200);
}

}
