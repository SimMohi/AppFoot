<?php


namespace App\Controller;


use App\Entity\Notification;
use App\Entity\PlayerUnofficialMatch;
use App\Entity\UnOfficialMatch;
use App\Entity\UserTeam;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class UnOfficialMatchController extends AbstractController
{
    /**
     * @Route("/unOffMatch/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function unOffMatch(int $id){
        $response = [];
        $response["called"] = [];
        $response["notCalled"] = [];
        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(["id" => $id]);
        if ($match->getIsHome()){
            $response["name"] = "FC Ronvau Chaumont - ".$match->getOpponent()->getName();
        } else {
            $response["name"] = $match->getOpponent()->getName(). " - FC Ronvau Chaumont";
        }
        $response["cat"] = $match->getTeamRonvau()->getCategory();
        $response["date"] = $match->getDate();
        $teamUsers = $match->getTeamRonvau()->getUserTeams();
        $accepted = 0;
        foreach ($teamUsers as $teamUser){
            $user = [];
            if ($teamUser->getIsPlayer() == false){
                continue;
            }
            $user["id"] = $teamUser->getUserId()->getId();
            $user["idUserTeam"] = $teamUser->getId();
            $user["name"] = $teamUser->getUserId()->getLastName() ." ". $teamUser->getUserId()->getFirstName();
            $called = $this->getDoctrine()->getRepository(PlayerUnofficialMatch::class)->findOneBy(["userTeam" => $teamUser, "unOfficialMatch" => $match]);
            if ($called === null){
                $user["called"] = false;
                $response["notCalled"][] = $user;
            }else {
                $user["called"] = true;
                if ($called->getHasConfirmed()){
                    $user["hasComfirmed"] = true;
                    $accepted++;
                } else {
                    $user["hasComfirmed"] = false;
                }
                if ($called->getHasRefused()){
                    $user["hasRefused"] = true;
                } else {
                    $user["hasRefused"] = false;
                }
                $response["called"][] = $user;
            }
        }
        $response["accepted"] = $accepted;
        $response["total"] = count($response["called"]);
        return $this->json($response);
    }

    /**
     * @Route("/selectUnoff")
     * @param Request $request
     * @return JsonResponse
     */
    public function selectUnoff (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $calls = $data["call"];
        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(["id" => $data["match"]]);
        if ($match->getIsHome()){
            $name = "FC Ronvau Chaumont - ". $match->getOpponent()->getName();
        } else {
            $name =  $match->getOpponent()->getName() .' - ' . "FC Ronvau Chaumont";
        }

        foreach ($calls as $call){
            if ($call["called"]){
                $newPlayer = new PlayerUnofficialMatch();
                $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(["id" => $call["idUserTeam"]]);
                $newPlayer->setUserTeam($userTeam);
                $newPlayer->setUnOfficialMatch($match);
                $notif = new Notification();
                $notif->setUser($userTeam->getUserId());
                $notif->setMessage("Vous avez été sélectionné pour le match ".$name);
                $this->getDoctrine()->getManager()->persist($notif);
                $this->getDoctrine()->getManager()->persist($newPlayer);
                $this->getDoctrine()->getManager()->flush();
            }
        }
        return $this->json($data["call"]);
    }

    /**
     * @Route("/delUnOffPl")
     * @param Request $request
     * @return JsonResponse
     */
    public function delUnOffPl (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(["id" => $data["idUserTeam"]]);
        $unOffMatch = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(["id" => $data["idMatch"]]);
        if ($unOffMatch->getIsHome()){
            $name = "FC Ronvau Chaumont - ". $unOffMatch->getOpponent()->getName();
        } else {
            $name =  $unOffMatch->getOpponent()->getName() .' - ' . "FC Ronvau Chaumont";
        }
        $player = $this->getDoctrine()->getRepository(PlayerUnofficialMatch::class)->findOneBy(["userTeam" => $userTeam, 'unOfficialMatch' => $unOffMatch]);

        $notif = new Notification();
        $notif->setUser($userTeam->getUserId());
        $notif->setMessage("Votre sélection pour le match ".$name. ' a été annulée');

        $this->getDoctrine()->getManager()->persist($notif);
        $this->getDoctrine()->getManager()->remove($player);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("Supprimé avec succès");
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/editDateUnOffMatch")
     * @throws \Exception
     */
    public function editDateUnOffMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $date = new \DateTime($data["date"]);
        $start = explode(":", $data["hour"]);
        $date->setTime($start[0], $start[1], 0);

        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(['id' => $data["id"]]);
        $match->setDate($date);
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("La date a bien été modifiée");
    }
}