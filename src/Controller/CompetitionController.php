<?php


namespace App\Controller;


use App\Entity\Competition;

class CompetitionController
{

    /**
     * @param Competition $competition
     */
    public function __invoke(Competition $competition)
    {
        return $competition->getName();
    }

}