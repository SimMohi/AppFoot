<?php


namespace App\Controller;

use App\Entity\Matche;

class GetMatcheFromMatchDayController
{

//    private $id;
//
//    public function __construct($id)
//    {
//        $this->id = $id;
//    }

    /**
     * @param Matche $matche
     */
    public function __invoke(int $id)
    {
        return $id+4;
    }
}