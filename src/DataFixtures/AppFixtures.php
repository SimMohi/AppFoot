<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Team;
use App\Entity\User;
use App\Entity\Table;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * Encode password
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder) 
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        
        $faker = Factory::create('fr_FR');

        for($u = 0; $u < 5; $u++){
            $user = New User();
            $hash = $this->encoder->encodePassword($user, 'password');
            $user->setFirstName($faker->firstName)
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);
            $manager->persist($user);
        }
        $user = New User();
        $hash = $this->encoder->encodePassword($user, 'password');
        $user->setFirstName("Simon")
            ->setLastName("Mohimont")
            ->setEmail("simon.mohimont@hotmail.com")
            ->setPassword($hash);
        $manager->persist($user);

        $manager->flush();
    }
}
