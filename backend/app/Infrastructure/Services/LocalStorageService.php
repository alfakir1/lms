<?php

namespace App\Infrastructure\Services;

use App\Application\Interfaces\StorageServiceInterface;
use Illuminate\Support\Facades\Storage;

class LocalStorageService implements StorageServiceInterface
{
    public function uploadFile(string $path, $contents): string
    {
        Storage::disk('public')->put($path, $contents);
        return $path;
    }

    public function deleteFile(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }

    public function generateSecureUrl(string $path): string
    {
        // For local storage, we just return the asset URL.
        // In a real system, you might generate signed URLs even for local storage.
        return asset('storage/' . $path);
    }
}
