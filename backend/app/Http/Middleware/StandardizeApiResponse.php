<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StandardizeApiResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof JsonResponse) {
            $data = $response->getData(true);
            $statusCode = $response->getStatusCode();

            // If the response is already in our standard format strictly, return it
            if (is_array($data) && isset($data['status']) && array_key_exists('data', $data) && count($data) <= 3) {
                return $response;
            }

            // Determine status
            $status = $statusCode >= 200 && $statusCode < 300 ? 'success' : 'error';
            
            // Extract message if it exists
            $message = '';
            if (is_array($data) && isset($data['message'])) {
                $message = $data['message'];
                unset($data['message']);
            }

            if (is_array($data)) {
                // Remove legacy 'success' boolean flag if present
                if (isset($data['success'])) {
                    unset($data['success']);
                }

                // If data only contains 'data' now, unwrap it
                if (isset($data['data']) && count($data) === 1) {
                     $data = $data['data'];
                }
            }

            $formattedResponse = [
                'status' => $status,
                'data' => $data,
                'message' => $message
            ];

            $response->setData($formattedResponse);
        }

        return $response;
    }
}
