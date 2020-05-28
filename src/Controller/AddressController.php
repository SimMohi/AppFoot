<?php


namespace App\Controller;


use App\Entity\Address;
use App\Entity\Chat;
use App\Entity\Club;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class AddressController extends AbstractController
{

    /**
     * @Route("/postProfile")
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function postProfile(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data['userId']]);
        $address = $user->getAddress();

        if ($address === null){
            $address = new Address();
        }
        if (isset($data["box"])) $address->setBox($data["box"]);
        if (isset($data["street"]))$address->setStreet($data["street"]);
        if (isset($data["city"])) $address->setCity($data["city"]);
        if (isset($data["code"])) $address->setCode($data["code"]);
        if (isset($data["number"])) $address->setNumber($data["number"]);
        $user->setAddress($address);
        $this->getDoctrine()->getManager()->persist($address);
        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush();
        return $this->json($data);
    }

    /**
     * @Route("/postClubAddress")
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function postClubAddress(Request $request){
        $data = $request->getContent();
        $data = json_decode($data, true);

        $club = $this->getDoctrine()->getRepository(Club::class)->findOneBy(['id' => $data['clubId']]);
        $address = $club->getAddress();

        if ($address === null){
            $address = new Address();
        }
        $address->setStreet($data["street"]);
        $address->setCity($data["city"]);
        $address->setCode($data["code"]);
        $address->setNumber($data["number"]);

        $this->getDoctrine()->getManager()->persist($address);
        $club->setAddress($address);
        $this->getDoctrine()->getManager()->persist($club);
        $this->getDoctrine()->getManager()->flush();
        return $this->json($data);
    }
}