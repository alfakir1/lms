<?php

namespace App\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuperAdmin extends Model
{
    use HasFactory;

    protected $table = 'superadmins';
    protected $fillable = ['user_id', 'can_manage_admins'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
