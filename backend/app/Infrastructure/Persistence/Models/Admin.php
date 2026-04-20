<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'department', 'permissions'];
    protected $casts = ['permissions' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
