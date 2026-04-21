<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Application\Interfaces\StorageServiceInterface;
use App\Infrastructure\Services\LocalStorageService;
use App\Application\Interfaces\PaymentRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\EloquentPaymentRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(StorageServiceInterface::class, LocalStorageService::class);
        $this->app->bind(PaymentRepositoryInterface::class, EloquentPaymentRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Event::listen(
            \App\Application\Events\PaymentApproved::class,
            \App\Infrastructure\Listeners\CreateEnrollmentListener::class
        );
    }
}
