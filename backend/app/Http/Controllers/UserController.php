<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Stat;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

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

        Log::info('user.registered', [
            'user_id' => $user->id_user,
            'nick'    => $user->nick,
            'email'   => $user->email,
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

        Log::warning('user.deleted', [
            'user_id' => $user->id_user,
            'nick'    => $user->nick,
        ]);
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
        Log::warning('user.password_changed', [
            'user_id' => $user->id_user,
            'nick'    => $user->nick,
        ]);

        return response()->json([
            'message' => "Password updated successfully"
        ], 200);
    }

    public function getIdByEmail($email)
    {
        $user = User::where('email', $email)->firstOrFail();

        return response()->json([
            'id_user' => $user->id_user
        ], 200);
    }

    public function getLeaderboard(Request $request)
    {
        $topUsers = User::orderBy('points', 'desc')
            ->select('id_user', 'nick', 'points')
            ->take(50)
            ->get();

        $leaderboard = $topUsers->map(function ($user, $index) {
            return [
                'pos' => $index + 1,
                'nick' => $user->nick,
                'points' => $user->points,
                'is_current' => false
            ];
        })->toArray();

        $currentUser = $request->user(); 

        if ($currentUser) {
            $inTop50 = false;
            
            foreach ($leaderboard as &$row) {
                if ($row['nick'] === $currentUser->nick) {
                    $row['is_current'] = true;
                    $inTop50 = true;
                    break;
                }
            }

            if (!$inTop50 && count($leaderboard) === 50) {
                $leaderboard[49] = [
                    'pos' => '50+',
                    'nick' => $currentUser->nick,
                    'points' => $currentUser->points,
                    'is_current' => true
                ];
            }
        }

        return response()->json($leaderboard, 200);
    }

    public function getRecentActivity(string $id)
    {
        $activities = DB::table('match_user')
            ->join('matches', 'match_user.id_match', '=', 'matches.id_match')
            ->join('games', 'matches.id_game', '=', 'games.id_game')
            ->where('match_user.id_user', $id)
            ->orderBy('match_user.date', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) use ($id) {
                return [
                    'game_name' => $item->name ?? 'Unknown',
                    'result'    => ($item->id_winner == $id) ? 'Victory' : 'Defeat',
                    'points'    => $item->points,
                    'date'      => \Carbon\Carbon::parse($item->date)->diffForHumans(),
                ];
            });

        return response()->json($activities);
    }

}
