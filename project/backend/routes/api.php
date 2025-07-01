<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Models\Product;
use App\Http\Controllers\OfferController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::post('/products/import-excel', [ProductController::class, 'importExcel']);
Route::post('/products', [ProductController::class, 'store']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::get('/products', function () {
    return Product::all();
});

Route::get('/test-db', function () {
    return Product::all();
});

Route::middleware('auth:sanctum')->apiResource('offers', OfferController::class);

