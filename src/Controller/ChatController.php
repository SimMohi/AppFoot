<?php


namespace App\Controller;


use App\Entity\Chat;
use App\Entity\TeamRonvau;
use App\Entity\User;
use App\Entity\UserTeam;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


class ChatController extends AbstractController
{

    /**
     * Get Chat channel and messages for user
     * @Route("/getChatInfo/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getChatInfo(int $id){
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        $userTeams = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(['userId' => $user]);
        $response = [];
        foreach ($userTeams as $userTeam){
            $teamRes = [];
            $teamRes["messages"] = [];
            $teamR =  $userTeam->getTeamRonvauId();
            $messages = $this->getDoctrine()->getRepository(Chat::class)->findAll();
            foreach ($messages as $message){
                if ($message->getSender()->getTeamRonvauId()->getId() == $teamR->getId()){
                    $messageRes = [];
                    $messageRes["senderId"] =  $message->getSender()->getUserId()->getId();
                    $messageRes["sender"] = $message->getSender()->getUserId()->getLastName()." " . $message->getSender()->getUserId()->getFirstName();
                    $messageRes["text"] = $message->getMessage();
                    $messageRes["date"] = $message->getDate();
                    $teamRes["messages"][] = $messageRes;
                }
            }
            $teamRes["channel"] = $teamR->getCategory();
            $teamRes["channelId"] = $teamR->getId();
            $response[] = $teamRes;
        }
        return $this->json($response);
    }

    /**
     * Get Chat channel and messages for user
     * @Route("/postMessage")
     * @param Request $request
     * @return JsonResponse
     */
    public function postMessage(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data['userId']]);
        $teamRonvau = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $data['teamId']]);
        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['userId' => $user, 'teamRonvauId' => $teamRonvau]);

        $newChat = new Chat();
        $newChat->setMessage($data["message"]);
        $newChat->setDate(new \DateTime());
        $newChat->setSender($userTeam);

        $this->getDoctrine()->getManager()->persist($newChat);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Message envoyé avec succès");
    }
}