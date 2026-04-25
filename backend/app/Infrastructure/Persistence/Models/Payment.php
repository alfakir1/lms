<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $appends = ['proof_url'];

    protected $fillable = [
        'user_id', 
        'course_id', 
        'amount', 
        'payment_method', 
        'status', 
        'proof_image', 
        'reference_code',
        'reviewed_by', 
        'reviewed_at'
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function getProofUrlAttribute(): ?string
    {
        if (! $this->proof_image) {
            return null;
        }

        // Uses APP_URL to generate an absolute URL when configured.
        return asset('storage/' . ltrim($this->proof_image, '/'));
    }

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
