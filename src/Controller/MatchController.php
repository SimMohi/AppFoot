<?php


namespace App\Controller;


use App\Entity\Matche;
use App\Entity\PlayerMatch;
use App\Entity\UserTeam;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class MatchController extends AbstractController
{

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/postCallMatch")
     */
    public function postCallMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $users = $data["call"];
        $response = array();
        foreach ($users as $user){
            if ($user["called"] == false) continue;
            $matchPlayer = new PlayerMatch();
            $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['id' => $user["id"]]);
            $matchPlayer->setIdUserTeam($userTeam);

            $userTeam = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $data["match"]]);
            $matchPlayer->setIdMatch($userTeam);

            $this->getDoctrine()->getManager()->persist($matchPlayer);
            $response[] = $matchPlayer->getId();
        }
        $this->getDoctrine()->getManager()->flush();

        return $this->json($response);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/postEncodeMatch")
     */
    public function postEncodeMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $users = $data;
        $response = array();
        foreach ($users as $user){
            $matchPlayer = $this->getDoctrine()->getRepository(PlayerMatch::class)->findOneBy(['id' => $user["id"]]);

            if (isset($user["played"])){
                $matchPlayer->setPlayed($user["played"]);
            }

            if (isset($user["goal"])){
                $matchPlayer->setGoal($user["goal"]);
            }

            if (isset($user["redCard"])){
                $matchPlayer->setRedCard($user["redCard"]);
            }

            if (isset($user["yellowCard"])){
                $matchPlayer->setYellowCard($user["yellowCard"]);
            }

            $this->getDoctrine()->getManager()->persist($matchPlayer);
            $response[] = $matchPlayer->getId();
        }
        $this->getDoctrine()->getManager()->flush();

        return $this->json($response);
    }
}