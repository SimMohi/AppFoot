<?php


namespace App\Controller;


use App\Entity\Competition;
use App\Entity\Team;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class GetTeamNotInCompetitionController extends AbstractController
{

    /**
     * @param Competition $competition
     */
    public function __invoke(Competition $competition)
    {
        $em = $this->getDoctrine()->getManager();
        $teams = $em->getRepository(Team::class)->findAll();
        $data = array();
        foreach ($teams as $team){
            $data[] = $team->getId();
        }
        $competTeams = $competition->getTeams();
    }



}