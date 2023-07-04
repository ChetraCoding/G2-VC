<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    protected $fillable = [
        'name',
        'street',
        'city'
    ];
    public function tables():HasMany {
        return $this->hasMany(Table::class);
    }
    public function categorys():HasMany {
        return $this->hasMany(Category::class);
    }
    public function products():HasMany {
        return $this->hasMany(Product::class);
    }
    public function orders():HasMany {
        return $this->hasMany(Order::class);
    }

}
