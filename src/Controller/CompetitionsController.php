<?php


namespace App\Controller;

use App\Entity\Club;
use App\Entity\Competition;
use App\Entity\Matche;
use App\Entity\Team;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;


class CompetitionsController extends AbstractController
{
    /**
     * @Route("/getCompetitionsRonvau")
     */
    public function getCompetitionsRonvau()
    {
        $ronvau = $this->getDoctrine()->getRepository(Club::class)->findOneBy(['name' => "F.C. Ronvau Chaumont"]);
        $teams = $this->getDoctrine()->getRepository(Team::class)->findBy(['club' => $ronvau->getId()]);
        $response = array();
        foreach ($teams as $team){
            $competition = $this->getDoctrine()->getRepository(Competition::class)->findOneBy(['id' => $team->getCompetition()->getId()]);
            $add = array();
            $add["id"] = $competition->getId();
            $add["name"] = $competition->getName();
            $response[] = $add;
        }

        return $this->json(
            $response
        );
    }

    /**
     * @Route("/getRonvauMatch/{idCompet}/{matchDay}")
     * @param int $idCompet
     * @param int $matchDay
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getRonvauMatch(int $idCompet, int $matchDay){

        $competition = $this->getDoctrine()->getRepository(Competition::class)->findOneBy(['id' => $idCompet]);

        $teams = $this->getDoctrine()->getRepository(Team::class)->findBy(['competition' => $competition]);
        $response = array();
        $double = array();
        if (count($teams) >= 0){
            foreach ($teams as $team){
                $matchA = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['homeTeam' => $team, 'matchDay' => $matchDay]);
                $matchB = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['visitorTeam' => $team, 'matchDay' => $matchDay]);
                if($matchA !== null) {
                    $add = array();
                    $add["id"] = $matchA->getId();
                    $add["homeTeam"] = $matchA->getHomeTeam();
                    $add["visitorTeam"] = $matchA->getVisitorTeam();
                    $add["homeTeamGoal"] = $matchA->getHomeTeamGoal();
                    $add["visitorTeamGoal"] = $matchA->getVisitorTeamGoal();
                    $add["isOver"] = $matchA->getIsOver();
                    if (!in_array($add["id"], $double)){
                        $double[] = $add["id"];
                        $response[] = $add;
                    }
                } elseif ($matchB !== null){
                    $add = array();
                    $add["id"] = $matchB->getId();
                    $add["homeTeam"] = $matchB->getHomeTeam();
                    $add["visitorTeam"] = $matchB->getVisitorTeam();
                    $add["homeTeamGoal"] = $matchB->getHomeTeamGoal();
                    $add["visitorTeamGoal"] = $matchB->getVisitorTeamGoal();
                    $add["isOver"] = $matchB->getIsOver();
                    if (!in_array($add["id"], $double)){
                        $double[] = $add["id"];
                        $response[] = $add;
                    }
                }
            }
        }

        return $this->json($response);
    }
}