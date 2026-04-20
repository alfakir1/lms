<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    use HasFactory;

    protected $fillable = ['course_id', 'instructor_id', 'start_time', 'end_time', 'status'];
    protected $casts = ['start_time' => 'datetime', 'end_time' => 'datetime'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(Attendance::class, 'session_id');
    }

    public function qrTokens()
    {
        return $this->hasMany(QrToken::class, 'session_id');
    }

    public function activeToken()
    {
        return $this->hasOne(QrToken::class, 'session_id')
            ->where('is_used', false)
            ->where('expires_at', '>', now());
    }
}
