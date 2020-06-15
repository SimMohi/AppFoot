<?php


namespace App\Controller;


use App\Entity\Club;
use App\Entity\Notification;
use App\Entity\PlayerUnofficialMatch;
use App\Entity\TeamRonvau;
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
        $response["appointment"] = $match->getAppointmentHour();
        $response["id"] =  $match->getId();

        if ($match->getIsHome()){
            $response["name"] = "FC Ronvau Chaumont - ".$match->getOpponent()->getName(). " : " . $match->getteamRonvau()->getCategory();
            $response["home"] = true;
        } else {
            $response["name"] = $match->getOpponent()->getName(). " - FC Ronvau Chaumont";
            $response["home"] = false;
        }
        if ( $match->getRonvauTeamGoal() === null){
            $response["ronvauGoal"] = "";
        } else {
            $response["ronvauGoal"] = $match->getRonvauTeamGoal();
        }
        if ( $match->getOpponentGoal() === null){
            $response["opponentGoal"] = "";
        } else {
            $response["opponentGoal"] = $match->getOpponentGoal();
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
                if ($called->getPlayed()){
                    $user["played"] = $called->getPlayed();
                } else {
                    $user["played"] = false;
                }
                if ($called->getRedCard()){
                    $user["red"] = $called->getRedCard();
                } else {
                    $user["red"] = false;
                }

                $user["goal"] = $called->getGoal();
                $user["yellow"] = $called->getYellowCard();

                $user["refusedJustification"] = $called->getRefusedJustification();
                $response["called"][] = $user;
            }
        }
        $response["accepted"] = $accepted;
        $response["total"] = count($response["called"]);
        return $this->json($response);
    }

    /**
     * @Route("/calledPlayerUnOffMatch/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function calledPlayerUnOffMatch(int $id)
    {
        $response = [];
        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(["id" => $id]);
        $called = $match->getPlayerUnofficialMatches();

        foreach ($called as $call){
            $response[] = $call->getUserTeam()->getUserId()->getFirstName() . " " . $call->getUserTeam()->getUserId()->getLastName();
        }
        return $this->json($response);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/postEncodeUnOffMatch")
     */
    public function postEncodeUnOffMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $users = $data["players"];
        $response = array();
        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(['id' => $data["idMatch"]]);
        $match->setRonvauTeamGoal($data["goalRonvau"]);
        $match->setOpponentGoal($data["opponentGoal"]);
        $match->setIsOver(true);

        foreach ($users as $user) {
            $matchPlayer = $this->getDoctrine()->getRepository(PlayerUnofficialMatch::class)->findOneBy(['userTeam' => $user["idUserTeam"], 'unOfficialMatch' => $match]);

            if (isset($user["played"])) {
                $matchPlayer->setPlayed($user["played"]);
            }

            if (isset($user["goal"])) {
                $matchPlayer->setGoal($user["goal"]);
            }

            if (isset($user["red"])) {
                $matchPlayer->setRedCard($user["red"]);
            }

            if (isset($user["yellow"])) {
                $matchPlayer->setYellowCard($user["yellow"]);
            }
            $this->getDoctrine()->getManager()->persist($matchPlayer);
        }
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();

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
        $appointment = new \DateTime($data["appointment"]);
        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(["id" => $data["match"]]);
        $match->setAppointmentHour($appointment);
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
                $this->getDoctrine()->getManager()->persist($newPlayer);
                $notif = new Notification();
                $user = $userTeam->getUserId();
                $notif->setUser($user);
                $message = "Vous avez été convoqué pour le match ".$name;
                $notif->setMessage($message);
                $token = $userTeam->getUserId()->getTokenMobile();
                if ($token != null){
                    $token = "ExponentPushToken[DHjFUSLcYJ9ijIo5jSLK7u]";
                    $url = "https://notif-tfe.herokuapp.com/";
                    $fields = [
                        "token" => $token,
                        "mess" => $message
                    ];
                    $fields_string = http_build_query($fields);
                    $ch = curl_init();
                    curl_setopt($ch,CURLOPT_URL, $url);
                    curl_setopt($ch,CURLOPT_POST, true);
                    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
                    $result = curl_exec($ch);
                }

            }
        }
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("ok");
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
     * @Route("/acceptPlayer")
     * @param Request $request
     * @return JsonResponse
     */
    public function acceptPlayer (Request $request){
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

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/acceptConvoc")
     * @throws \Exception
     */
    public function acceptConvoc(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(["id" => $data["userTeam"]]);
        $unOffMatch = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(["id" => $data["unOfficialMatch"]]);
        $player = $this->getDoctrine()->getRepository(PlayerUnofficialMatch::class)->findOneBy(['userTeam' => $userTeam, 'unOfficialMatch' => $unOffMatch]);

        if ($data["accept"] == true){
            $player->setHasConfirmed(true);
        } else {
            $player->setHasRefused(true);
            $player->setRefusedJustification($data["reason"]);
        }

        $this->getDoctrine()->getManager()->persist($player);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("OK");
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/createUnOff")
     * @throws \Exception
     */
    public function createUnOff(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $opponent = $this->getDoctrine()->getRepository(Club::class)->findOneBy(["id" => $data["opponent"]]);
        $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(["id" => $data["teamRonvau"]]);

        $unOff = new UnOfficialMatch();
        $date = new \DateTime($data["date"]);
        $start = explode(":", $data["time"]);
        $date->setTime($start[0], $start[1], 0);
        $unOff->setDate($date);
        $unOff->setIsHome($data["isHome"]);
        $unOff->setTeamRonvau($teamR);
        $unOff->setOpponent($opponent);


        $this->getDoctrine()->getManager()->persist($unOff);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("OK");
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/deleteUnOff")
     */
    public function deleteUnOff(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(["id" => $data["id"]]);
        $isHome = $match->getIshome();
        if ($isHome){
            $name = "Le match amical FC Ronvau Chaumont - ". $match->getOpponent()->getName(). " a été annulé";
        } else {
            $name = "Le match amical ".$match->getOpponent()->getName(). " - FC Ronvau Chaumont a été annulé ";
        }
        $teamR = $match->getTeamRonvau();
        $uts = $teamR->getUserTeams();
        foreach ($uts as $ut){
            $not = new Notification();
            $not->setUser($ut->getUserId());
            $not->setMessage($name);
            $this->getDoctrine()->getManager()->persist($not);
        }
        $this->getDoctrine()->getManager()->remove($match);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("ok");
    }
}