<?php


namespace App\Controller;

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
        $teamR = $eventTeam->getIdTeamRonvau();
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["user"]]);

        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['userId' => $user, 'teamRonvauId' => $teamR]);

        $userTeamEvent = new UserTeamEvent();
        $userTeamEvent->setEventTeam($eventTeam);
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
        $teamR = $eventTeam->getIdTeamRonvau();
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["user"]]);

        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['userId' => $user, 'teamRonvauId' => $teamR]);

        $userTeamEvent =  $this->getDoctrine()->getRepository(UserTeamEvent::class)->findOneBy(['eventTeam' => $eventTeam, 'userTeam' => $userTeam]);

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
            $eventsTeam = $userTeam->getTeamRonvauId()->getEventsTeams();
            foreach ($eventsTeam as $eventTeam){
                $userTeamEvent = $eventTeam->getUserTeamEvents();
                $event = $eventTeam->getIdEvents();
                $eventsArr = array();
                $eventsArr["id"] = $event->getId();
                $eventsArr["name"] = $event->getName();
                $eventsArr["date"] = $event->getDate();
                $eventsArr["description"] = $event->getDescription();
                $teamArr["events"][] = $eventsArr;
            }
            $response[] = $teamArr;
        }
        return $this->json($response);
    }
}