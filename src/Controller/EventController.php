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
}