<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuotePdfController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/generate-pdf', [QuotePdfController::class, 'generate']);
