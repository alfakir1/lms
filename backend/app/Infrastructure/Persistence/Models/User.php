<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected static function newFactory()
    {
        return \Database\Factories\UserFactory::new();
    }

    protected $fillable = [
        'name', 'email', 'phone', 'password',
        'role', 'status', 'device_uuid', 'fingerprint_hash',
    ];

    protected $hidden = ['password', 'remember_token', 'fingerprint_hash'];

    protected $casts = ['email_verified_at' => 'datetime'];

    // Roles: super_admin, admin, instructor, student
    public function isRole(string $role): bool
    {
        return $this->role === $role;
    }

    /* ---------- Relations ---------- */
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function instructor()
    {
        return $this->hasOne(Instructor::class);
    }

    public function admin()
    {
        return $this->hasOne(Admin::class);
    }

    public function superAdmin()
    {
        return $this->hasOne(SuperAdmin::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function lectureProgresses()
    {
        return $this->hasMany(LectureProgress::class);
    }
}
