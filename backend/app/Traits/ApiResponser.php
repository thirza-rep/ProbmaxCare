<?php

namespace App\Traits;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponser
{
    /**
     * Build success response
     * @param  mixed $data
     * @param  string $message
     * @param  int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse($data, $message = null, $code = 200)
    {
        return response()->json([
            'status' => 'Success',
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Build error response
     * @param  string $message
     * @param  int $code
     * @param  mixed $errors
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse($message, $code, $errors = null)
    {
        return response()->json([
            'status' => 'Error',
            'message' => $message,
            'errors' => $errors,
            'data' => null
        ], $code);
    }

    /**
     * Build not found response
     * @param  string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function notFoundResponse($message = 'Resource not found')
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Build unauthorized response
     * @param  string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function unauthorizedResponse($message = 'Unauthorized')
    {
        return $this->errorResponse($message, 401);
    }

    /**
     * Build validation error response
     * @param  mixed $errors
     * @param  string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function validationErrorResponse($errors, $message = 'Data tidak valid')
    {
        return $this->errorResponse($message, 422, $errors);
    }
}
