<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LectureProgress extends Model
{
    use HasFactory;

    protected $table = 'lecture_progress';

    protected $fillable = [
        'user_id',
        'lecture_id',
        'watch_time',
        'last_position',
        'completed_at'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'watch_time' => 'integer',
        'last_position' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lecture()
    {
        return $this->belongsTo(Lecture::class);
    }
}
