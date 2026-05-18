<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id('id_match');
            $table->datetime('init_date');
            $table->datetime('end_date');
            $table->foreignId('id_game')->constrained('games', 'id_game')->onDelete('cascade');
            $table->foreignId('id_winner')->nullable()->constrained('users', 'id_user')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
