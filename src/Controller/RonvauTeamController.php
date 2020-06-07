<?php


namespace App\Controller;


use App\Entity\Event;
use App\Entity\EventsTeam;
use App\Entity\Matche;
use App\Entity\PlayerMatch;
use App\Entity\PlayerOfTheMatch;
use App\Entity\PlayerTraining;
use App\Entity\Team;
use App\Entity\TeamRonvau;
use App\Entity\Training;
use App\Entity\TrainingDay;
use App\Entity\User;
use App\Entity\UserTeam;
use App\Entity\UserTeamEvent;
use App\Repository\TrainingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\lib;


class RonvauTeamController extends AbstractController
{

    /**
     * @Route("/postTrainingDay")
     * @param Request $request
     * @return JsonResponse
     */
    public function postTrainingDay (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $day = $data["day"];
        $start = explode(":", $data["hourStart"]);
        $end = explode(":", $data["hourEnd"]);
        $teamId = $data["teamRonvau"];
        $begin  = new \DateTime();

        if ($begin->format("m") > 5 ){
            $year = $begin->format("Y")+1;
            $max = new \DateTime($year."-06-01");
        } else {
            $max = new \DateTime($begin->format("Y")."-06-01");
        }

        switch ($day) {
            case "Lundi":
                $weekDay = "Mon";
                break;
            case "Mardi":
                $weekDay = "Tue";
                break;
            case "Mercredi":
                $weekDay = "Wed";
                break;
            case "Jeudi":
                $weekDay = "Thu";
                break;
            case "Vendredi":
                $weekDay = "Fri";
                break;
            case "Samedi":
                $weekDay = "Sat";
                break;
            case "Dimanche":
                $weekDay = "Sun";
                break;
            default :
                return $this->json("Mauvais jour encodé");
        }
        $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $teamId]);
        $copyStart = clone $begin;
        $copyEnd = clone $begin;
        $copyStart->setTime($start[0], $start[1], 0);
        $copyEnd->setTime($end[0], $end[1], 0);

        $newTrD = new TrainingDay();
        $newTrD->setTeamRonvau($teamR);
        $newTrD->setDay($day);
        $newTrD->setHourStart($copyStart);
        $newTrD->setHourEnd($copyEnd);
        $this->getDoctrine()->getManager()->persist($newTrD);

        $response = [];
        while ($begin <= $max){
            if($begin->format("D") == $weekDay)
            {
                $newTraining = new Training();
                $startNew = clone $begin;
                $startNew->setTime($start[0], $start[1], 0);
                $endNew = clone $begin;
                $endNew->setTime($end[0], $end[1], 0);
                $newTraining->setStart($startNew);
                $newTraining->setEnd($endNew);
                $newTraining->setTeamRonvau($teamR);
                $this->getDoctrine()->getManager()->persist($newTraining);
                $usersTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(['teamRonvauId' => $teamR]);
                foreach ($usersTeam as $ut){
                    $newUserTr = new PlayerTraining();
                    $newUserTr->setIdUserTeam($ut);
                    $newUserTr->setIdTraining($newTraining);
                    $this->getDoctrine()->getManager()->persist($newUserTr);
                }
            }

            $begin->modify('+1 day');
        }
        $this->getDoctrine()->getManager()->flush();
        return $this->json($response);

    }

    /**
     * @Route("/deleteTrainingDay")
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteTrainingDay (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $trainingDayId = $data["id"];
        $teamId = $data["teamR"];
        $day = $data["day"];

        switch ($day) {
            case "Lundi":
                $weekDay = "Mon";
                break;
            case "Mardi":
                $weekDay = "Tue";
                break;
            case "Mercredi":
                $weekDay = "Wed";
                break;
            case "Jeudi":
                $weekDay = "Thu";
                break;
            case "Vendredi":
                $weekDay = "Fri";
                break;
            case "Samedi":
                $weekDay = "Sat";
                break;
            case "Dimanche":
                $weekDay = "Sun";
                break;
            default :
                return $this->json("Mauvais jour encodé");
        }
        $trainingDay = $this->getDoctrine()->getRepository(TrainingDay::class)->findOneBy(['id' => $trainingDayId]);
        $this->getDoctrine()->getManager()->remove($trainingDay);
        $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $teamId]);
        $trainings = $this->getDoctrine()->getRepository(Training::class)->findBy([ 'teamRonvau' => $teamR]);
        if (count($trainings) > 0){
            foreach ($trainings as $training){
                $day = $training->getStart();
                if($day->format("D") == $weekDay){
                    $this->getDoctrine()->getManager()->remove($training);
                }
            }
        }
        $this->getDoctrine()->getManager()->flush();

        return $this->json("");
    }

    /**
     * @Route("/getCalendarInfo/{teamId}/{date}")
     * @param $teamId
     * @param $date
     * @return JsonResponse
     * @throws \Exception
     */
    public function getCalendarInfo ($teamId, $date){

        $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $teamId]);
        $trainings = $this->getDoctrine()->getRepository(Training::class)->findBy([ 'teamRonvau' => $teamR]);

        $response =  [];
        foreach ($trainings as $training){
            $trainingRes = [];
            $start = $training->getStart();
            if ($date != "no"){
                $date = new \DateTime($date);
                if ($start->format("YMD") == $date->format("YMD")){
                    $end = $training->getEnd();
                    $trainingRes["type"] = "Entraînement";
                    $trainingRes["date"] = $start->format("m/d");
                    $trainingRes["start"] = $start->format("H:i");
                    $trainingRes["end"] = $end->format("H:i");
                    $response[] = $trainingRes;
                }
            } else{
                $end = $training->getEnd();
                $trainingRes["type"] = "Entrainement";
                $trainingRes["date"] = $start->format("m/d");
                $trainingRes["start"] = $start->format("H:i");
                $trainingRes["end"] = $end->format("H:i");
                $response[] = $trainingRes;
            }
        }
        $eventsTeams = $this->getDoctrine()->getRepository(EventsTeam::class)->findBy(['idTeamRonvau' => $teamR]);
        foreach ($eventsTeams as $eventsTeam){
            $eventRes = [];
            $eventsTeamId = $eventsTeam->getIdEvents()->getId();
            $event = $this->getDoctrine()->getRepository(Event::class)->findOneBy(['id' => $eventsTeamId]);
            $eventRes["name"] = $event->getName();
            $eventRes["date"] = $event->getDate()->format("Y-m-d");
            $eventRes["description"] = $event->getDescription();
            $response[] = $eventRes;
        }

        return $this->json($response);

    }

    /**
     * @Route("/getPersonnalCalendarInfo/{userId}")
     * @param $userId
     * @return JsonResponse
     * @throws \Exception
     */
    public function getPersonnalCalendarInfo ($userId){

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $userId]);
        $userTeams = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(['userId' => $user]);
        $response =  [];
        foreach ($userTeams as $userTeam){
            $teamR = $userTeam->getTeamRonvauId();
            $team = $teamR->getTeam();
            $trainings = $this->getDoctrine()->getRepository(Training::class)->findBy([ 'teamRonvau' => $teamR]);

            foreach ($trainings as $training){
                $trainingRes = [];
                if ($userTeam->getIsStaff() === true){
                    $absences = $this->getDoctrine()->getRepository(PlayerTraining::class)->findBy([ 'idTraining' => $training]);
                    $absArr = [];
                    $presArr = [];
                    foreach ($absences as $absence){
                        $absUser = [];
                        $userAbs = $absence->getIdUserTeam()->getUserId();
                        $userName = $userAbs->getLastName(). " " . $userAbs->getFirstName();
                        $absUser["name"] = $userName;
                        $absUser["id"] = $absence->getId();
                        $absUser["reason"] = $absence->getAbsenceJustification();
                        if ($absence->getIsAbsent()){
                            $absArr[] = $absUser;
                        } else{
                            $presArr = $absUser;
                        }
                    }
                    if ($userTeam->getIsStaff()){
                        $trainingRes["absences"] = $absArr;
                        $trainingRes["presences"] = $presArr;
                    }
                } else{
                    $trainingRes["staff"] = false;
                }

                $start = $training->getStart();
                $end = $training->getEnd();
                $trainingRes["id"] = $training->getId();
                $trainingRes["title"] = "Entraînement ".$teamR->getCategory();
                $trainingRes["type"] = "training";
                $trainingRes["date"] = $start;
                $trainingRes["start"] = $start;
                $trainingRes["end"] = $end;
                $trainingRes["player"] = $userTeam->getIsPlayer();-
                $trainingRes["staff"] = $userTeam->getIsStaff();
                $trainingRes["teamId"] = $teamR->getId();
                $trainingRes["teamCat"] = $teamR->getCategory();
                $isAbs = $this->getDoctrine()->getRepository(PlayerTraining::class)->findOneBy([ 'idTraining' => $training, 'idUserTeam' => $userTeam]);
                $trainingRes["abs"] = $isAbs->getIsAbsent();
                $response[] = $trainingRes;
            }
            $eventsTeams = $this->getDoctrine()->getRepository(EventsTeam::class)->findBy(['idTeamRonvau' => $teamR]);
            foreach ($eventsTeams as $eventsTeam){
                $eventRes = [];
                $event = $eventsTeam->getIdEvents();
                $eventRes["id"] = $event->getId();
                $eventRes["type"] = "event";
                $eventRes["title"] = $event->getName();
                $eventRes["start"] = $event->getDate();
                $eventRes["end"] = $event->getEndDate();
                $eventRes["description"] = $event->getDescription();
                $eventRes["staff"] = $userTeam->getIsStaff();
                $eventRes["teamId"] = $teamR->getId();
                $eventRes["teamCat"] = $teamR->getCategory();
                $eventRes["eventTeamId"] = $eventsTeam->getId();
                $userTeamEvent = $this->getDoctrine()->getRepository(UserTeamEvent::class)->findOneBy(['userTeam' => $userTeam, 'event' => $event]);
                if ($userTeamEvent === null){
                    $eventRes["sub"] = false;
                }
                $response[] = $eventRes;
            }

            $matchesTeamA = $this->getDoctrine()->getRepository(Matche::class)->findBy(['homeTeam' => $team]);
            $matchesTeamV = $this->getDoctrine()->getRepository(Matche::class)->findBy(['visitorTeam' => $team]);
            foreach ($matchesTeamA as $home){
                $matchRes = [];
                $matchRes["type"] = "Match";
                $matchRes["id"] = $home->getId();
                $matchRes["title"] = $home->getHomeTeam()->getClub()->getName()."-".$home->getVisitorTeam()->getClub()->getName();
                $matchRes["start"] = $home->getDate();
                $matchRes["end"] = $home->getDate();
                $matchRes["staff"] = $userTeam->getIsStaff();
                $matchRes["teamId"] = $teamR->getId();
                $matchRes["teamCat"] = $teamR->getCategory();
                if ($home->getIsOver()) {
                    $matchRes["isOver"] = $home->getIsOver();
                }
                $players =  $home->getPlayerMatches();
                foreach ($players as $player){
                    if ($player->getPlayed()){
                        $name = $player->getIdUserTeam()->getUserId()->getFirstName()." ". $player->getIdUserTeam()->getUserId()->getLastName();
                        $newPlayer = [];
                        $newPlayer["userId"] = $player->getIdUserTeam()->getUserId()->getId();
                        if ($player->getIdUserTeam()->getUserId() == $user){
                            if ($player->getHasConfirmed() == false && $player->getHasRefused() == false){
                                $matchRes["perso"] = "Vous avez été convoqué pour ce match";
                            } else if ($player->getHasConfirmed() == true && $home->getIsOver() == false){
                                $matchRes["perso"] = "Vous avez accepté la convocation pour ce match";
                            }
                        }
                        $newPlayer["player"] = $player;
                        $newPlayer["name"] = $name;
                        $matchRes["players"][] = $newPlayer;
                    }
                }
                $response[] = $matchRes;
            }
            foreach ($matchesTeamV as $visitor){
                $matchRes = [];
                $matchRes["type"] = "Match";
                $matchRes["id"] = $visitor->getId();
                $matchRes["title"] = $visitor->getHomeTeam()->getClub()->getName()."-".$visitor->getVisitorTeam()->getClub()->getName();
                $matchRes["start"] = $visitor->getDate();
                $matchRes["end"] = $visitor->getDate();
                $matchRes["staff"] = $userTeam->getIsStaff();
                $matchRes["teamId"] = $teamR->getId();
                $matchRes["teamCat"] = $teamR->getCategory();
                if ($visitor->getIsOver()){
                    $matchRes["isOver"] = $visitor->getIsOver();
                }
                $players =  $visitor->getPlayerMatches();
                foreach ($players as $player){
                    $name = $player->getIdUserTeam()->getUserId()->getFirstName()." ". $player->getIdUserTeam()->getUserId()->getLastName();
                    $newPlayer = [];
                    $newPlayer["userId"] = $player->getIdUserTeam()->getUserId()->getId();
                    if ($player->getIdUserTeam()->getUserId() == $user){
                        if ($player->getHasConfirmed() == false && $player->getHasRefused() == false){
                            $matchRes["perso"] = "Vous avez été convoqué pour ce match";
                        } else if ($player->getHasConfirmed() == true && $visitor->getIsOver() == false){
                            $matchRes["perso"] = "Vous avez accepté la convocation pour ce match";
                        }
                    }
                    $newPlayer["player"] = $player;
                    $newPlayer["name"] = $name;
                    $matchRes["players"][] = $newPlayer;
                }
                $response[] = $matchRes;
            }
            $unofficialMatchs = $teamR->getUnOfficialMatches();
            foreach ($unofficialMatchs as $unofficialMatch){
                $matchRes = [];
                $matchRes["players"] = [];
                $matchRes["type"] = "Amical";
                $matchRes["id"] = $unofficialMatch->getId();
                if ($unofficialMatch->getIsHome()){
                    $matchRes["title"] = "Fc Ronvau Chaumont" ."-".$unofficialMatch->getOpponent()->getName();
                } else{
                    $matchRes["title"] = $unofficialMatch->getOpponent()->getName()."-"."Fc Ronvau Chaumont" ;
                }
                $matchRes["start"] = $unofficialMatch->getDate();
                $matchRes["end"] = $unofficialMatch->getDate();
                $matchRes["staff"] = $userTeam->getIsStaff();
                $matchRes["teamId"] = $teamR->getId();
                $matchRes["teamCat"] = $teamR->getCategory();
                if ($unofficialMatch->getIsOver()){
                    $matchRes["isOver"] = $unofficialMatch->getIsOver();
                }
                $players =  $unofficialMatch->getPlayerUnofficialMatches();
                foreach ($players as $player){
                    $name = $player->getUserTeam()->getUserId()->getFirstName()." ". $player->getUserTeam()->getUserId()->getLastName();
                    $newPlayer = [];
                    $newPlayer["userId"] = $player->getUserTeam()->getUserId()->getId();
                    if ($player->getUserTeam()->getUserId() == $user){
                        if ($player->getHasConfirmed() == false && $player->getHasRefused() == false){
                            $matchRes["perso"] = "Vous avez été convoqué pour ce match";
                        } else if ($player->getHasConfirmed() == true && $unofficialMatch->getIsOver() == false){
                            $matchRes["perso"] = "Vous avez accepté la convocation pour ce match";
                        }
                    }
//                    $newPlayer["player"] = $player;
                    $newPlayer["name"] = $name;
                    $matchRes["unOffPlayers"][] = $newPlayer;
                }
                $response[] = $matchRes;
            }
        }

        return $this->json($response);

    }

    /**
     * @Route("/postEventTeams")
     * @param Request $request
     * @return JsonResponse
     */
    public function postEventTeams (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $event = $this->getDoctrine()->getRepository(Event::class)->findOneBy(['id' => $data["event"]]);
        $eventTeams = $this->getDoctrine()->getRepository(EventsTeam::class)->findBy(['idEvents' => $event]);
        $eventTeamsIdRt = array();
        foreach ($eventTeams as $eventTeam){
            $eventTeamsIdRt[] = $eventTeam->getidTeamRonvau()->getId();
        }

        foreach ($data["teams"] as $id){
            if (in_array($id, $eventTeamsIdRt)){
                $eventTeamsIdRt = array_diff($eventTeamsIdRt, array($id));
                continue;
            }
            $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $id]);
            $newEventTeam = new EventsTeam();
            $newEventTeam->setIdEvents($event);
            $newEventTeam->setIdTeamRonvau($teamR);
            $this->getDoctrine()->getManager()->persist($newEventTeam);
        }
        if (count($eventTeamsIdRt) > 0){
            foreach ($eventTeamsIdRt as $del){
                $delEventTeam = $this->getDoctrine()->getRepository(EventsTeam::class)->findOneBy(['idTeamRonvau' => $del, 'idEvents' => $event]);
                $this->getDoctrine()->getManager()->remove($delEventTeam);
            }
        }
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Equipes ajoutées avec succès à l'événement");
    }

    /**
     * @Route("/postAbsence")
     * @param Request $request
     * @return JsonResponse
     */
    public function postAbsence(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["idUser"]]);
        $training = $this->getDoctrine()->getRepository(Training::class)->findOneBy(['id' => $data["idTraining"]]);
        $teamR = $training->getTeamRonvau();
        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['userId' => $user, 'teamRonvauId' => $teamR]);

        $trainingPl = $this->getDoctrine()->getRepository(PlayerTraining::class)->findOneBy(['idUserTeam' => $userTeam, 'idTraining' => $training]);
        $trainingPl->setAbsenceJustification($data["reason"]);
        $trainingPl->setIsAbsent(true);
        $this->getDoctrine()->getManager()->persist($trainingPl);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Absence encodé avec succès");
    }

    /**
     * @Route("/remAbsence")
     * @param Request $request
     * @return JsonResponse
     */
    public function remAbsence(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["idUser"]]);
        $training = $this->getDoctrine()->getRepository(Training::class)->findOneBy(['id' => $data["idTraining"]]);
        $teamR = $training->getTeamRonvau();
        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['userId' => $user, 'teamRonvauId' => $teamR]);

        $trainingPl = $this->getDoctrine()->getRepository(PlayerTraining::class)->findOneBy(['idUserTeam' => $userTeam, 'idTraining' => $training]);
        $trainingPl->setAbsenceJustification(null);
        $trainingPl->setIsAbsent(false);
        $this->getDoctrine()->getManager()->persist($trainingPl);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Absence encodé avec succès");
    }

    /**
     * @Route("/getTrainingPlayer/{idTraining}")
     * @param int $idTraining
     * @return JsonResponse
     */
    public function getTrainingPlayer(int $idTraining){
        $training = $this->getDoctrine()->getRepository(Training::class)->findOneBy(['id' => $idTraining]);
        $teamR = $training->getTeamRonvau();

        $trainingPl = $this->getDoctrine()->getRepository(PlayerTraining::class)->findBy(['idTraining' => $training, 'isAbsent' => false]);
        $response = array();
        foreach ($trainingPl as $item){
            $userArr = [];
            $user = $item->getIdUserTeam()->getUserId();
            $userName = $user->getLastName(). " " . $user->getFirstName();
            $userArr["name"] = $userName;
            $userArr["id"] = $item->getId();
            $userArr["present"] = $item->getWasPresent();
            $response[] = $userArr;
        }
        return $this->json($response);
    }

    /**
     * @Route("/postPresence")
     * @param Request $request
     * @return JsonResponse
     */
    public function postPresence(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        foreach ($data as $arr){
            $trainingPl = $this->getDoctrine()->getRepository(PlayerTraining::class)->findOneBy(['id' => $arr["id"]]);
            $trainingPl->setWasPresent($arr["value"]);
            $this->getDoctrine()->getManager()->persist($trainingPl);
        }

        $this->getDoctrine()->getManager()->flush();
        return $this->json($data);
    }

    /**
     * @Route("/editTraining")
     * @param Request $request
     * @return JsonResponse
     */
    public function editTraining(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $start = explode(":", $data["start"]);
        $end = explode(":", $data["end"]);

        $training = $this->getDoctrine()->getRepository(Training::class)->findOneBy(['id' => $data["id"]]);
        $startTr = new \DateTime($data["date"]);
        $endTr = clone $startTr;
        $startTr->setTime($start[0], $start[1], 0);
        $endTr->setTime($end[0], $end[1], 0);

        $training->setStart($startTr);
        $training->setEnd($endTr);
        $this->getDoctrine()->getManager()->persist($training);

        $this->getDoctrine()->getManager()->flush();
        return $this->json($data);
    }

    /**
     * @Route("/voteMOTM")
     * @param Request $request
     * @return JsonResponse
     */
    public function voteMOTM (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $playerMatch = $this->getDoctrine()->getRepository(PlayerMatch::class)->findOneBy(['id' => $data["idPlayerMatch"]]);
        $teamRonvau = $playerMatch->getIdUserTeam()->getTeamRonvauId();

        $userVote = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['teamRonvauId' => $teamRonvau, 'userId' => $data["idUser"]]);

        $newVote = new PlayerOfTheMatch();
        $newVote->setIdPlayerMatch($playerMatch);
        $newVote->setIdUserTeam($userVote);
        $this->getDoctrine()->getManager()->persist($newVote);

        $this->getDoctrine()->getManager()->flush();
        return $this->json("Vote enregistré");
    }

    /**
     * @Route("/voteMOTM/{idMatch}")
     * @param int $idMatch
     * @return JsonResponse
     */
    public function getVoteMOTM (int $idMatch){

        $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $idMatch]);
        $playerMatchs = $match->getPlayerMatches();

        $response = [];
        foreach ($playerMatchs as $playerMatch){
            $motm = $this->getDoctrine()->getRepository(PlayerOfTheMatch::class)->findBy(['idPlayerMatch' => $playerMatch]);
            $vote = [];
            $vote["id"] = $playerMatch->getId();
            $vote["number"] = count($motm);
        }

        return $this->json("Vote enregistré");
    }

    /**
     * @Route("/getTeamMember/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getTeamMember (int $id){

        $team = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $id]);
        $userTeams = $team->getUserTeams();
        $response = [];
        $response["category"] = $team->getCategory();
        $response["coachs"] = [];
        $response["players"] = [];
        $response["supporters"] = [];
        foreach ($userTeams as $userTeam) {
            $utArr = [];
            $utArr["name"] = $userTeam->getUserId()->getLastName() . " " . $userTeam->getUserId()->getFirstName();
            $utArr["id"] = $userTeam->getUserId()->getId();
            $play = 0;
            $goal = 0;
            $yellow = 0;
            $red = 0;
            $trainingN = 0;
            if ($userTeam->getIsPlayer()) {
                $matchs = $userTeam->getPlayerMatches();
                $trainings = $userTeam->getPlayerTrainings();
                foreach ($matchs as $match) {
                    if ($match->getPlayed()) {
                        $play += 1;
                        $goal += $match->getGoal();
                        $yellow += $match->getYellowCard();
                        $red += $match->getRedCard();
                    }
                }
                foreach ($trainings as $training) {
                    if ($training->getWasPresent()) {
                        $trainingN += 1;
                    }
                }
                $utArr["train"] = $trainingN;
                $utArr["play"] = $play;
                $utArr["goal"] = $goal;
                $utArr["yellow"] = $yellow;
                $utArr["red"] = $red;
                $response["players"][] = $utArr;
            }
            if ($userTeam->getIsStaff()) {
                $utArr["tel"] = $userTeam->getUserId()->getGsm();
                $utArr["email"] = $userTeam->getUserId()->getEmail();
                $response["coachs"][] = $utArr;
            } elseif ($userTeam->getIsPlayer() == false && $userTeam->getIsStaff() == false){
                $response["supporters"][] = $utArr;
            }
        }

        return $this->json($response);
    }
}