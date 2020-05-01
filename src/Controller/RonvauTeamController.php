<?php


namespace App\Controller;


use App\Entity\Event;
use App\Entity\EventsTeam;
use App\Entity\Team;
use App\Entity\TeamRonvau;
use App\Entity\Training;
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
     * @Route("/postTrainingDay/")
     * @param Request $request
     * @return JsonResponse
     */
    public function postTrainingDay (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $day = $data["day"];
        $start = explode(":", $data["start"]);
        $end = explode(":", $data["end"]);
        $teamId = $data["teamId"];
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

        $response = [];
        while ($begin <= $max){
            if($begin->format("D") == $weekDay)
            {
                $copyStart = clone $begin;
                $copyEnd = clone $begin;
                $copyStart->setTime($start[0], $start[1], 0);
                $copyEnd->setTime($end[0], $end[1], 0);

                $newTraining = new Training();
                $newTraining->setStart($copyStart);
                $newTraining->setEnd($copyEnd);
                $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $teamId]);
                $newTraining->setTeamRonvau($teamR);
                $this->getDoctrine()->getManager()->persist($newTraining);
            }

            $begin->modify('+1 day');
        }
        $this->getDoctrine()->getManager()->flush();
        return $this->json($response);

    }

    /**
     * @Route("/deleteTrainingDay/")
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteTrainingDay (Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);
        $teamId = $data["teamId"];
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

        $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $teamId]);
        $trainings = $this->getDoctrine()->getRepository(Training::class)->findBy([ 'teamRonvau' => $teamR]);
        if (count($trainings) > 0){
            foreach ($trainings as $training){
                $day = $training->getStart();
                if($day->format("D") == $weekDay){
                    $this->getDoctrine()->getManager()->remove($training);
                }
            }
            $this->getDoctrine()->getManager()->flush();
        }

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
            $trainings = $this->getDoctrine()->getRepository(Training::class)->findBy([ 'teamRonvau' => $teamR]);

            foreach ($trainings as $training){
                $trainingRes = [];
                $start = $training->getStart();
                $end = $training->getEnd();
                $trainingRes["type"] = "Entraînement";
                $trainingRes["date"] = $start->format("m/d");
                $trainingRes["start"] = $start->format("H:i");
                $trainingRes["end"] = $end->format("H:i");
                $response[] = $trainingRes;
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
}