<?php


namespace App\Controller;


use App\Entity\Event;
use App\Entity\EventsTeam;
use App\Entity\Matche;
use App\Entity\PlayerTraining;
use App\Entity\Team;
use App\Entity\TeamRonvau;
use App\Entity\Training;
use App\Entity\TrainingDay;
use App\Entity\User;
use App\Entity\UserTeam;
use App\Repository\TrainingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;



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
        $doubleEvent = [];
        foreach ($userTeams as $userTeam){
            $teamR = $userTeam->getTeamRonvauId();
            $team = $teamR->getTeam();
            $trainings = $this->getDoctrine()->getRepository(Training::class)->findBy([ 'teamRonvau' => $teamR]);

            foreach ($trainings as $training){
                $trainingRes = [];
                if ($userTeam->getIsStaff() === true){
                    $absences = $this->getDoctrine()->getRepository(PlayerTraining::class)->findBy([ 'idTraining' => $training, 'isAbsent' => true]);
                    $absArr = [];
                    foreach ($absences as $absence){
                        $absUser = [];
                        $userAbs = $absence->getIdUserTeam()->getUserId();
                        $userName = $userAbs->getLastName(). " " . $userAbs->getFirstName();
                        $absUser["name"] = $userName;
                        $absUser["reason"] = $absence->getAbsenceJustification();
                        $absArr[] = $absUser;
                    }
                    $trainingRes["absences"] = $absArr;
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
                $trainingRes["staff"] = $userTeam->getIsStaff();
                $isAbs = $this->getDoctrine()->getRepository(PlayerTraining::class)->findOneBy([ 'idTraining' => $training, 'idUserTeam' => $userTeam]);
                $trainingRes["abs"] = $isAbs->getIsAbsent();
                $response[] = $trainingRes;
            }
            $eventsTeams = $this->getDoctrine()->getRepository(EventsTeam::class)->findBy(['idTeamRonvau' => $teamR]);
            foreach ($eventsTeams as $eventsTeam){
                $eventRes = [];
                $event = $eventsTeam->getIdEvents();
                if (in_array($event->getId(), $doubleEvent)) continue;
                $eventRes["id"] = $event->getId();
                $eventRes["type"] = "Event";
                $eventRes["title"] = $event->getName();
                $eventRes["start"] = $event->getDate();
                $eventRes["end"] = $event->getDate();
                $eventRes["description"] = $event->getDescription();
                $eventRes["staff"] = $userTeam->getIsStaff();
                $response[] = $eventRes;
                $doubleEvent[] = $event->getId();
            }

            $matchesTeamA = $this->getDoctrine()->getRepository(Matche::class)->findBy(['homeTeam' => $team]);
            $matchesTeamN = $this->getDoctrine()->getRepository(Matche::class)->findBy(['visitorTeam' => $team]);
            foreach ($matchesTeamA as $home){
                $matchRes = [];
                $matchRes["type"] = "Match";
                $matchRes["id"] = $home->getId();
                $matchRes["title"] = $home->getHomeTeam()->getClub()->getName()."-".$home->getVisitorTeam()->getClub()->getName();
                $matchRes["start"] = $home->getDate();
                $matchRes["end"] = $home->getDate();
                $matchRes["staff"] = $userTeam->getIsStaff();
                $response[] = $matchRes;
            }
            foreach ($matchesTeamN as $visitor){
                $matchRes = [];
                $matchRes["type"] = "Match";
                $matchRes["id"] = $visitor->getId();
                $matchRes["title"] = $visitor->getHomeTeam()->getClub()->getName()."-".$visitor->getVisitorTeam()->getClub()->getName();
                $matchRes["start"] = $visitor->getDate();
                $matchRes["end"] = $visitor->getDate();
                $matchRes["staff"] = $userTeam->getIsStaff();
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
}