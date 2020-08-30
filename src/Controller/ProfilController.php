<?php

namespace App\Controller;


use App\Entity\Address;
use App\Entity\Chat;
use App\Entity\Matche;
use App\Entity\PlayerMatch;
use App\Entity\PlayerUnofficialMatch;
use App\Entity\Team;
use App\Entity\TeamRonvau;
use App\Entity\User;
use App\Entity\UserTeam;
use phpDocumentor\Reflection\Types\Object_;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class ProfilController extends AbstractController
{
    /**
     * @Route("/profile/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getInfoUser(int $id){

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        $address = $user->getAddress();
        $userTeams = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(['userId' => $user]);
        $return = array();
        if ($address !== null){
            $return["address"]["id"] = $address->getId();
            $return["address"]["street"] = $address->getStreet();
            $return["address"]["code"] = $address->getCode();
            $return["address"]["city"] = $address->getCity();
            $return["address"]["number"] = $address->getNumber();
            $return["address"]["box"] = $address->getBox();
        } else {
            $return["address"] = array();
        }
        $return["infos"] = [];
        foreach ($userTeams as $userTeam){
            $category = $userTeam->getTeamRonvauId()->getCategory();
            $userMatchs = $this->getDoctrine()->getRepository(PlayerMatch::class)->findBy(['idUserTeam' => $userTeam]);
            $response = array('goal' => 0, 'yellowCard' => 0, 'redCard' => 0, 'played' => 0, 'team' => $category);
            foreach ($userMatchs as $userMatch){
                $response["goal"] += $userMatch->getGoal();
                $response["yellowCard"] += $userMatch->getYellowCard();
                $response["redCard"] += $userMatch->getRedCard();
                $response["played"] += $userMatch->getPlayed();
            }
            $trainings = $userTeam->getPlayerTrainings();
            $trainingN = 0;
            foreach ($trainings as $training) {
                if ($training->getWasPresent()) {
                    $trainingN += 1;
                }
            }
            $response['training'] = $trainingN;
            $return["infos"][] = $response;
        }

        return $this->json($return);
    }

    /**
     * @Route("/getNotificationsUser/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getNotificationsUser(int $id){
        $return = array();
        $return["notif"] = array();
        $return["convocations"] = array();
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);
        $notifications = $user->getNotifications();
        foreach ($notifications as $notification){
            if ($notification->getHasSeen() == false){
                $notif = array();
                $notif["id"] = $notification->getId();
                $notif["message"] = $notification->getMessage();
                $return["notif"][] = $notif;
            }
        }
        $userTeams = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(['userId' => $user]);
        foreach ($userTeams as $userTeam){
            $ronvauTeam = $userTeam->getTeamRonvauId();
            $playerMatches = $this->getDoctrine()->getRepository(PlayerMatch::class)->findBy(['idUserTeam' => $userTeam]);
            $playerUnOffMatches = $this->getDoctrine()->getRepository(PlayerUnofficialMatch::class)->findBy(['userTeam' => $userTeam]);
            $matches = array();
            foreach ($playerMatches as $playerMatch){
                if ($playerMatch->getHasConfirmed() == false && $playerMatch->getHasRefused() == false){
                    $match = $playerMatch->getIdMatch();
                    $matches["name"] = $ronvauTeam->getCategory();
                    $matches["match"] = $match->getHomeTeam()->getClub()->getName()." - ". $match->getVisitorTeam()->getClub()->getName();
                    $matches["joueur"] = $playerMatch;
                    $matches["type"] = "officiel";
                    $return["convocations"][] = $matches;
                }
            }
            foreach ($playerUnOffMatches as $playerUnOffMatch){
                if ($playerUnOffMatch->getHasConfirmed() == false && $playerUnOffMatch->getHasRefused() == false){
                    $match = $playerUnOffMatch->getUnOfficialMatch();
                    $matches["name"] = $ronvauTeam->getCategory();
                    if ($match->getIsHome()){
                        $matches["match"] = "FC Ronvau Chaumont - ". $match->getOpponent()->getName();
                    } else{
                        $matches["match"] = $match->getOpponent()->getName()." - FC Ronvau Chaumont";
                    }
                    $matches["type"] = "amical";
                    $matches["joueur"] = $playerUnOffMatch;
                    $return["convocations"][] = $matches;
                }
            }
        }
        return $this->json($return);
    }

    /**
     * @Route("/postTokenMobile")
     * @param Request $request
     * @return JsonResponse
     */
    public function postTokenMobile(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["id"]]);

        $user->setTokenMobile($data["token"]);
        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("ok");
    }

    /**
     * @Route("/getTokenMobile/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function getTokenMobile(int $id){
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $id]);

        return $this->json($user->getTokenMobile());
    }

    /**
     * @Route("/uploadImage")
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadImage(Request $request){
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $_POST["id"]]);

//        $file_name = $_FILES["image"]['name'];
//        $file_extention = strrchr($file_name, ".");
//
//        $file_tmp_name = $_FILES["image"]["tmp_name"];
//        $file_dest = "profile/".$user->getFirstName().$user->getLastName().$file_extention;
//        if (move_uploaded_file($file_tmp_name, $file_dest)){
//        } else {
//            return $this->json("erreur");
//        }
//
//        $user->setProfilePic($file_dest);
        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();


        return $this->json("ok");
    }

    /**
     * @Route("/postParam")
     * @param Request $request
     * @return JsonResponse
     */
    public function postParam(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["id"]]);

        $user->setRgdpPhotos($data["photos"]);

        if ($data["select"] == 1){
            $user->setRgpdVisibleStaff(false);
            $user->setRgpdVisibleAll(false);
        } else if ($data["select"] == 2){
            $user->setRgpdVisibleStaff(true);
            $user->setRgpdVisibleAll(false);
        } else if ($data["select"] == 3){
            $user->setRgpdVisibleStaff(true);
            $user->setRgpdVisibleAll(true);
        }

        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("ok");

    }

    /**
     * @Route("/changePass")
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @return JsonResponse
     */
    public function changePass(Request $request, UserPasswordEncoderInterface $encoder){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data["id"]]);

        $valid = $encoder->isPasswordValid($user, $data["current"]);
        if ($valid == false){
            return $this->json("erreur");
        }

        $new = $encoder->encodePassword($user, $data["new"]);

        $user->setPassword($new);
        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("ok");
    }

}