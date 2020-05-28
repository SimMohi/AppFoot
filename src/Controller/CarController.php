<?php


namespace App\Controller;


use App\Entity\Address;
use App\Entity\Car;
use App\Entity\CarPassenger;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;


class CarController extends AbstractController
{

    /**
     * @Route("/createCar")
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return JsonResponse
     * @throws \Exception
     */
    public function createCar(Request $request, ValidatorInterface $validator)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        if (isset($data["id"]) && $data["id"] !== null){
            $car = $this->getDoctrine()->getRepository(Car::class)->findOneBy(['id' => $data['id']]);
        } else {
            $car = new Car();
        }

        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data['userId']]);
        $car->setTitle($data["title"]);
        $car->setUserId($user);
        $car->setDate(new \DateTime($data["date"]));
        $car->setPlaceRemaining($data["placeRemaining"]);
        if ($data["fromHome"]){
            if ($user->getAddress() === null){
                return $this->json(["status" => 500, "message" => "Vous n'avez pas d'adresse enregistrée"]);
            }
            $car->setDepartureAddress($user->getAddress());
        } else {
            $address = new Address();
            $address->setCity($data["city"]);
            $address->setStreet($data["street"]);
            $address->setCode($data["code"]);
            $address->setNumber($data["number"]);
            $car->setDepartureAddress($address);
            $this->getDoctrine()->getManager()->persist($address);
            $errors = $validator->validate($address);
            if (count($errors) > 0){
                return $this->json($errors);
            }
        }
        $errors = $validator->validate($car);
        if (count($errors) > 0){
            return $this->json($errors);
        }
        $this->getDoctrine()->getManager()->persist($car);
        $this->getDoctrine()->getManager()->flush();
        return $this->json($data);
    }

    /**
     * @Route("/addPassenger")
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function addPassenger(Request $request, ValidatorInterface $validator)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $car = $this->getDoctrine()->getRepository(Car::class)->findOneBy(['id' => $data['car']]);
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $data['user']]);

        $carPass = new CarPassenger();
        $carPass->setUser($user);
        $carPass->setComment($data["comment"]);
        $carPass->setCar($car);
        $carPass->setNumberPassenger($data["numberPassenger"]);
        $carPass->setIsAccepted(false);

        if ($data["fromHome"]){
            if ($user->getAddress() === null){
                return $this->json(["status" => 500, "message" => "Vous n'avez pas d'adresse enregistrée"]);
            }
            $carPass->setAddress($user->getAddress());
        } else {
            $address = new Address();
            $address->setCity($data["city"]);
            $address->setStreet($data["street"]);
            $address->setCode($data["code"]);
            $number = (int)$data["number"];
            $address->setNumber($number);
            $errors = $validator->validate($address);
            if (count($errors) > 0){
                return $this->json($errors);
            }
            $this->getDoctrine()->getManager()->persist($address);
        }
        $errors = $validator->validate($carPass);
        if (count($errors) > 0){
            return $this->json($errors);
        }

        $this->getDoctrine()->getManager()->persist($carPass);
        $this->getDoctrine()->getManager()->flush();
        return $this->json($data);
    }
}