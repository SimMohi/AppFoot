<?php


namespace App\Controller;


use App\Entity\Car;
use App\Entity\Notification;
use App\Entity\TeamRonvau;
use App\Entity\User;
use phpDocumentor\Reflection\Types\Array_;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends AbstractController
{

    /**
     * @Route("/seenNotif")
     * @param Request $request
     * @return JsonResponse
     */
    public function seenNotif(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $notification = $this->getDoctrine()->getRepository(Notification::class)->findOneBy(['id'=> $data["id"]]);
        $notification->setHasSeen(true);
        $this->getDoctrine()->getManager()->persist($notification);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Notification vue");
    }

    /**
     * @Route("/newTeamNotif")
     * @param Request $request
     * @return JsonResponse
     */
    public function newTeamNotif(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $data["idTeam"]]);
        $userTeams = $teamR->getUserTeams();
        $usersNoDouble = array();
        foreach ($userTeams as $userTeam){
            $user = $userTeam->getUserId();
            if (!in_array($user->getId(), $usersNoDouble)){
                $notification = new Notification();
                $notification->setUser($user);
                $notification->setMessage($data["message"]);
                $token = $user->getTokenMobile();
                if ($token != null){
                    $token = "ExponentPushToken[DHjFUSLcYJ9ijIo5jSLK7u]";
                    $url = "https://notif-tfe.herokuapp.com/";
                    $fields = [
                        "token" => $token,
                        "mess" => $data["message"]
                    ];
                    $fields_string = http_build_query($fields);
                    $ch = curl_init();
                    curl_setopt($ch,CURLOPT_URL, $url);
                    curl_setopt($ch,CURLOPT_POST, true);
                    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
                    $result = curl_exec($ch);
                }
                $this->getDoctrine()->getManager()->persist($notification);
            }
        }
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Notifications envoyées");
    }

    /**
     * @Route("/newNotifCarPass")
     * @param Request $request
     * @return JsonResponse
     */
    public function newNotifCarPass(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $car = $this->getDoctrine()->getRepository(Car::class)->findOneBy(['id' => $data["car"]]);
        $userPass = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["user"]]);
        $user = $car->getUserId();
        $notification = new Notification();
        $notification->setUser($user);
        $message = "Vous avez une demande de ".$userPass->getFirstName(). " " . $userPass->getLastName()." pour votre covoiturage nommé ". $car->getTitle();
        $notification->setMessage($message);
        $token = $user->getTokenMobile();
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
        $this->getDoctrine()->getManager()->persist($notification);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Notification envoyée");
    }

    /**
     * @Route("/newNotifCarPassAR")
     * @param Request $request
     * @return JsonResponse
     */
    public function newNotifCarPassAR(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $car = $this->getDoctrine()->getRepository(Car::class)->findOneBy(['id' => $data["car"]]);
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["user"]]);
        if ($data["accept"]){
            $accepte = "acceptée";
        } else {
            $accepte = "refusée";
        }
        $notification = new Notification();
        $notification->setUser($user);
        $message = "Votre demande pour le covoiturage nommé ". $car->getTitle(). " a été ".$accepte;
        $notification->setMessage($message);
        $token = $user->getTokenMobile();
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
        $this->getDoctrine()->getManager()->persist($notification);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("Notification envoyée");
    }
}