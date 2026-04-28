<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $fillable = ['enrollment_id', 'amount', 'issued_at', 'academy_name'];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
