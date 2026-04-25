<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;

abstract class Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests,
        \Illuminate\Foundation\Validation\ValidatesRequests;

    protected function apiResponse($status, $data = [], $message = '', $code = 200)
    {
        return response()->json([
            'status' => $status,
            'data' => $data,
            'message' => $message,
            'meta' => [
                'timestamp' => now()->toIso8601String(),
                'request_id' => Str::uuid()->toString(),
            ]
        ], $code);
    }
}
