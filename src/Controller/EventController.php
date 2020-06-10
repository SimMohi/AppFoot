<?php


namespace App\Controller;

use App\Entity\Event;
use App\Entity\EventsTeam;
use App\Entity\User;
use App\Entity\UserTeam;
use App\Entity\UserTeamEvent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class EventController extends AbstractController
{
    /**
     * @param Request $request
     * @Route("/subscribeUTE")
     * @return JsonResponse
     */
    public function subscribeUTE(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $eventTeam = $this->getDoctrine()->getRepository(EventsTeam::class)->findOneBy(['id' => $data["eventTeam"]]);
        $event = $eventTeam->getIdEvents();
        $teamR = $eventTeam->getIdTeamRonvau();
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["user"]]);

        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['userId' => $user, 'teamRonvauId' => $teamR]);

        $userTeamEvent = new UserTeamEvent();
        $userTeamEvent->setEvent($event);
        $userTeamEvent->setUserTeam($userTeam);

        $this->getDoctrine()->getManager()->persist($userTeamEvent);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("Inscription réussie");
    }

    /**
     * @param Request $request
     * @Route("/unSubscribeUTE")
     * @return JsonResponse
     */
    public function UnSubscribeUTE(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $eventTeam = $this->getDoctrine()->getRepository(EventsTeam::class)->findOneBy(['id' => $data["eventTeam"]]);
        $event = $eventTeam->getIdEvents();
        $teamR = $eventTeam->getIdTeamRonvau();
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["user"]]);

        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['userId' => $user, 'teamRonvauId' => $teamR]);

        $userTeamEvent =  $this->getDoctrine()->getRepository(UserTeamEvent::class)->findOneBy(['event' => $event, 'userTeam' => $userTeam]);

        $this->getDoctrine()->getManager()->remove($userTeamEvent);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("Désinscription réussie");
    }

    /**
     * @Route("/getEventUser/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getEventUser(int $id){
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        $userTeams = $user->getUserTeams();

        $response = array();
        foreach ($userTeams as $userTeam){
            $teamArr = array();
            $teamArr["name"] = $userTeam->getTeamRonvauId()->getCategory();
            $userTeamId =  $userTeam->getId();
            $teamArr["idUserTeam"] = $userTeamId;
            $eventsTeam = $userTeam->getTeamRonvauId()->getEventsTeams();
            $teamArr["events"] = [];
            foreach ($eventsTeam as $eventTeam){
                $event = $eventTeam->getIdEvents();
                $eventsArr = array();
                $userTeamEvents =  $event->getUserTeamEvents();
                $userTeamArr = array();
                foreach ($userTeamEvents as $userTeamEvent){
                    $userTeamArr[] = $userTeamEvent->getUserTeam()->getId();
                }
                if (in_array($userTeamId, $userTeamArr)){
                    $eventsArr["subsc"] = true;
                } else {
                    $eventsArr["subsc"] = false;
                }
                $eventsArr["id"] = $eventTeam->getId();
                $eventsArr["name"] = $event->getName();
                $eventsArr["date"] = $event->getDate();
                $eventsArr["description"] = $event->getDescription();
                $teamArr["events"][] = $eventsArr;
            }
            $response[] = $teamArr;
        }
        return $this->json($response);
    }

    /**
     * @Route("/getEventUserTeam/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getEventUserTeam(int $id){
        $event = $this->getDoctrine()->getRepository(Event::class)->findOneBy(['id' => $id]);
        $userTeamEvents = $event->getUserTeamEvents();
        $teamEvents = $event->getEventsTeams();

        $response = array();
        foreach ($teamEvents as $teamEvent){
            $userTeamArr = array();
            $cat = $teamEvent->getIdTeamRonvau()->getCategory();
            $userTeamArr["name"] = $cat;
            foreach ($userTeamEvents as $userTeamEvent){
                $userArr = [];
                $user =  $userTeamEvent->getUserTeam()->getUserId();
                $team =  $userTeamEvent->getUserTeam()->getTeamRonvauId();
                if ($team == $teamEvent->getIdTeamRonvau()){
                    $userArr["id"] = $user->getId();
                    $userArr["name"] = $user->getLastname(). " " . $user->getFirstName();
                    $userTeamArr["sub"][] = $userArr;
                }
            }
            $response[] = $userTeamArr;
        }

        return $this->json($response);
    }
}