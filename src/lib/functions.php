<?php

namespace App\lib;

function cmp($a, $b) {
    return strcmp($a->name, $b->name);
}