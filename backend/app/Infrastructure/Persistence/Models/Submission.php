<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id', 'student_id', 'file_url',
        'grade', 'comment', 'attempt_number', 'submitted_at', 'status',
    ];
    protected $casts = ['submitted_at' => 'datetime'];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
