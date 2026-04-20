<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'course_id', 
        'amount', 
        'payment_method', 
        'status', 
        'proof_image', 
        'reviewed_by', 
        'reviewed_at'
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
