<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ConversationController;
use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\MessageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Conversation routes
    Route::apiResource('conversations', ConversationController::class);
    
    // Message routes
    Route::apiResource('messages', MessageController::class);
    
    // Group routes
    Route::apiResource('groups', GroupController::class);
    Route::post('/groups/{id}/users', [GroupController::class, 'addUser']);
    Route::delete('/groups/{id}/users', [GroupController::class, 'removeUser']);
});