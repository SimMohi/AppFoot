<?php

namespace App\Controller;


use App\Entity\PlayerMatch;
use App\Entity\User;
use App\Entity\UserTeam;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;



class ProfilController extends AbstractController
{
    /**
     * @Route("/infoUser")
     */
    public function getInfoUser(){

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => 11]);
        $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['id' => $user->getId()]);
        $userMatch = $this->getDoctrine()->getRepository(PlayerMatch::class)->findBy(['id' => $userTeam->getId()]);


        return new Response(
            $user->getLastName()
        );
    }
}