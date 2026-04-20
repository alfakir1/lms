<?php

namespace App\Application\Interfaces;

interface StorageServiceInterface
{
    /**
     * Upload a file to storage and return its path.
     */
    public function uploadFile(string $path, $contents): string;

    /**
     * Delete a file from storage.
     */
    public function deleteFile(string $path): bool;

    /**
     * Generate a secure URL for the given path.
     */
    public function generateSecureUrl(string $path): string;
}
