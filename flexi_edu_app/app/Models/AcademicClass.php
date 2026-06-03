<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicClass extends Model
{
    protected $table = 'classes';

    protected $fillable = ['name', 'level', 'order', 'school_id'];

    public function sections() {
        return $this->hasMany(ClassSection::class, 'class_id'); 
    }

}
